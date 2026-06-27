const fs = require('fs');
const path = require('path');

function stableId(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/^[0-9]+\.\s*/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'section';
}

function lineRange(startIndex, endIndex) {
  return { line_start: startIndex + 1, line_end: endIndex + 1 };
}

function parsePromptContract(promptPath) {
  const text = fs.readFileSync(promptPath, 'utf8').replace(/\r\n/g, '\n');
  const lines = text.split('\n');
  const sections = [];
  let currentSection = null;
  let currentSubsection = null;

  lines.forEach((line, index) => {
    const sectionMatch = line.match(/^##\s+([0-9]{2,})\.\s*(.+?)\s*$/);
    if (sectionMatch) {
      currentSection = {
        number: sectionMatch[1],
        title: sectionMatch[2].trim(),
        id: `${sectionMatch[1]}-${stableId(sectionMatch[2])}`,
        line_start: index + 1,
        line_end: index + 1,
        text: '',
        subsections: [],
        features: []
      };
      sections.push(currentSection);
      currentSubsection = null;
      return;
    }
    const subsectionMatch = line.match(/^###\s+(.+?)\s*$/);
    if (subsectionMatch && currentSection) {
      currentSubsection = {
        title: subsectionMatch[1].trim(),
        id: `${currentSection.number}-${stableId(subsectionMatch[1])}`,
        line_start: index + 1,
        line_end: index + 1,
        text: '',
        features: []
      };
      currentSection.subsections.push(currentSubsection);
      return;
    }
    const featureMatch = line.match(/^####\s+(.+?)\s*$/);
    if (featureMatch && currentSection) {
      const feature = {
        title: featureMatch[1].trim(),
        id: `${currentSection.number}-${stableId(featureMatch[1])}`,
        line_start: index + 1,
        line_end: index + 1,
        text: ''
      };
      currentSection.features.push(feature);
      if (currentSubsection) currentSubsection.features.push(feature);
    }
  });

  if (sections.length === 0) throw new Error(`No numbered prompt sections found in ${promptPath}`);
  sections.forEach((section, index) => {
    const start = section.line_start - 1;
    const end = index + 1 < sections.length ? sections[index + 1].line_start - 2 : lines.length - 1;
    Object.assign(section, lineRange(start, end));
    section.text = lines.slice(start, end + 1).join('\n');
    section.subsections.forEach((subsection, subIndex) => {
      const subStart = subsection.line_start - 1;
      const nextSub = section.subsections[subIndex + 1];
      const subEnd = nextSub ? nextSub.line_start - 2 : end;
      Object.assign(subsection, lineRange(subStart, subEnd));
      subsection.text = lines.slice(subStart, subEnd + 1).join('\n');
    });
    section.features.forEach((feature, featureIndex) => {
      const featureStart = feature.line_start - 1;
      const nextFeature = section.features[featureIndex + 1];
      const featureEnd = nextFeature ? nextFeature.line_start - 2 : end;
      Object.assign(feature, lineRange(featureStart, featureEnd));
      feature.text = lines.slice(featureStart, featureEnd + 1).join('\n');
    });
  });

  return {
    prompt_path: promptPath.replace(/\\/g, '/'),
    prompt_file: path.basename(promptPath),
    total_characters: text.length,
    estimated_tokens: Math.ceil(text.length / 4),
    sections
  };
}

function requirementItems(contract) {
  return contract.sections.flatMap((section) => [
    { type: 'section', key: section.number, id: section.id, title: section.title, line_start: section.line_start, line_end: section.line_end, text: section.text },
    ...section.subsections.map((subsection) => ({ type: 'subsection', key: subsection.id, id: subsection.id, section: section.number, title: subsection.title, line_start: subsection.line_start, line_end: subsection.line_end, text: subsection.text })),
    ...section.features.map((feature) => ({ type: 'feature', key: feature.id, id: feature.id, section: section.number, title: feature.title, line_start: feature.line_start, line_end: feature.line_end, text: feature.text }))
  ]);
}

function selectPromptSections(contract, sectionNumbers) {
  const requested = sectionNumbers || [];
  const seen = new Set();
  for (const number of requested) {
    if (seen.has(number)) throw new Error(`Duplicate prompt section requested: ${number}`);
    seen.add(number);
  }
  const available = new Map(contract.sections.map((section) => [section.number, section]));
  const missing = requested.filter((number) => !available.has(number));
  if (missing.length) throw new Error(`Requested prompt section(s) do not exist: ${missing.join(', ')}`);
  return contract.sections
    .filter((section) => seen.has(section.number))
    .map((section) => section.text)
    .join('\n\n');
}

function selectPromptRequirements(contract, requirementIds) {
  const requested = requirementIds || [];
  const seen = new Set();
  const exact = new Map();
  requirementItems(contract).forEach((item) => {
    exact.set(item.key, item);
    exact.set(item.id, item);
  });
  const out = [];
  for (const requirementId of requested) {
    if (seen.has(requirementId)) throw new Error(`Duplicate prompt requirement requested: ${requirementId}`);
    seen.add(requirementId);
    const item = exact.get(requirementId);
    if (!item) throw new Error(`Requested prompt requirement does not exist: ${requirementId}`);
    out.push(item.text);
  }
  return out.join('\n\n');
}

function expandStageRequirementIds(contract, stage) {
  const explicit = stage.promptRequirements || [];
  const sectionNumbers = stage.promptSections || [];
  const ids = new Set(explicit);
  for (const sectionNumber of sectionNumbers) {
    const section = contract.sections.find((item) => item.number === sectionNumber);
    if (!section) {
      ids.add(sectionNumber);
      continue;
    }
    ids.add(section.number);
    ids.add(section.id);
    section.subsections.forEach((subsection) => ids.add(subsection.id));
    section.features.forEach((feature) => ids.add(feature.id));
  }
  return [...ids];
}

function buildCoverage(contract, stages, sharedRequirements = []) {
  const items = requirementItems(contract);
  const known = new Map(items.flatMap((item) => [[item.key, item], [item.id, item]]));
  const shared = new Set(sharedRequirements);
  const owners = new Map(items.map((item) => [item.id, []]));
  const referencedMissing = [];
  stages.forEach((stage) => {
    expandStageRequirementIds(contract, stage).forEach((requirementId) => {
      const item = known.get(requirementId);
      if (!item) referencedMissing.push({ stage: stage.name, requirement: requirementId });
      else if (!owners.get(item.id).includes(stage.name)) owners.get(item.id).push(stage.name);
    });
  });
  const uncovered = [];
  const multiplyOwned = [];
  for (const item of items) {
    const itemOwners = owners.get(item.id) || [];
    if (itemOwners.length === 0 && !shared.has(item.id) && !shared.has(item.key)) uncovered.push({ type: item.type, id: item.id, title: item.title });
    if (itemOwners.length > 1 && !shared.has(item.id) && !shared.has(item.key)) multiplyOwned.push({ type: item.type, id: item.id, owners: itemOwners });
  }
  return {
    all_sections: contract.sections.map((section) => ({
      number: section.number,
      title: section.title,
      id: section.id,
      line_start: section.line_start,
      line_end: section.line_end
    })),
    all_subsections: contract.sections.flatMap((section) => section.subsections.map((subsection) => ({
      section: section.number,
      title: subsection.title,
      id: subsection.id,
      line_start: subsection.line_start,
      line_end: subsection.line_end
    }))),
    all_features: contract.sections.flatMap((section) => section.features.map((feature) => ({
      section: section.number,
      title: feature.title,
      id: feature.id,
      line_start: feature.line_start,
      line_end: feature.line_end
    }))),
    owning_generation_stages: Object.fromEntries([...owners.entries()]),
    shared_global_requirements: sharedRequirements,
    uncovered_requirements: uncovered,
    multiply_owned_requirements: multiplyOwned,
    referenced_missing_requirements: referencedMissing,
    passed: uncovered.length === 0 && referencedMissing.length === 0
  };
}

function assertCoverage(coverage) {
  if (coverage.referenced_missing_requirements.length) {
    throw new Error(`Stage plan references nonexistent prompt requirement(s): ${coverage.referenced_missing_requirements.map((item) => `${item.stage}:${item.requirement}`).join(', ')}`);
  }
  if (coverage.uncovered_requirements.length) {
    throw new Error(`Prompt requirements have no generation owner: ${coverage.uncovered_requirements.map((item) => item.id).join(', ')}`);
  }
}

function promptSizeManifest(parts, budgetCharacters) {
  const creativeChars = parts.creativeText.length;
  const sharedChars = parts.sharedText.length;
  const requiredWritableChars = parts.requiredWritableFiles.reduce((sum, file) => sum + (file.content || '').length, 0);
  const optionalWritableChars = parts.optionalWritableFiles.reduce((sum, file) => sum + (file.content || '').length, 0);
  const readonlyChars = parts.readonlyFiles.reduce((sum, file) => sum + (file.content || '').length, 0);
  const protocolChars = parts.protocolText.length;
  const total = parts.finalPrompt.length;
  return {
    total_prompt_characters: total,
    estimated_tokens: Math.ceil(total / 4),
    stage_creative_requirement_characters: creativeChars,
    shared_global_requirement_characters: sharedChars,
    required_writable_context_characters: requiredWritableChars,
    optional_writable_context_characters: optionalWritableChars,
    read_only_context_characters: readonlyChars,
    protocol_rules_characters: protocolChars,
    number_of_required_writable_files: parts.requiredWritableFiles.length,
    number_of_optional_writable_files: parts.optionalWritableFiles.length,
    number_of_read_only_files: parts.readonlyFiles.length,
    budget_characters: budgetCharacters,
    within_budget: total <= budgetCharacters
  };
}

module.exports = {
  assertCoverage,
  buildCoverage,
  expandStageRequirementIds,
  parsePromptContract,
  promptSizeManifest,
  requirementItems,
  selectPromptRequirements,
  selectPromptSections
};
