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

function buildCoverage(contract, stages, sharedSections = []) {
  const bySection = new Map(contract.sections.map((section) => [section.number, []]));
  const referencedMissing = [];
  stages.forEach((stage) => {
    (stage.promptSections || []).forEach((sectionNumber) => {
      if (!bySection.has(sectionNumber)) referencedMissing.push({ stage: stage.name, section: sectionNumber });
      else bySection.get(sectionNumber).push(stage.name);
    });
  });
  const uncovered = [];
  const multiplyOwned = [];
  for (const section of contract.sections) {
    const owners = bySection.get(section.number) || [];
    if (owners.length === 0 && !sharedSections.includes(section.number)) uncovered.push(section.number);
    if (owners.length > 1) multiplyOwned.push({ section: section.number, owners });
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
    owning_generation_stages: Object.fromEntries([...bySection.entries()]),
    shared_global_requirements: sharedSections,
    uncovered_requirements: uncovered,
    multiply_owned_requirements: multiplyOwned,
    referenced_missing_requirements: referencedMissing,
    passed: uncovered.length === 0 && referencedMissing.length === 0
  };
}

function assertCoverage(coverage) {
  if (coverage.referenced_missing_requirements.length) {
    throw new Error(`Stage plan references nonexistent prompt section(s): ${coverage.referenced_missing_requirements.map((item) => `${item.stage}:${item.section}`).join(', ')}`);
  }
  if (coverage.uncovered_requirements.length) {
    throw new Error(`Prompt sections have no generation owner: ${coverage.uncovered_requirements.join(', ')}`);
  }
}

function promptSizeManifest(promptText, writableFiles, readonlyFiles, budgetCharacters) {
  const creativeChars = promptText.length;
  const writableChars = writableFiles.reduce((sum, file) => sum + (file.content || '').length, 0);
  const readonlyChars = readonlyFiles.reduce((sum, file) => sum + (file.content || '').length, 0);
  const total = creativeChars + writableChars + readonlyChars;
  return {
    total_prompt_characters: total,
    estimated_tokens: Math.ceil(total / 4),
    creative_requirement_characters: creativeChars,
    writable_context_characters: writableChars,
    read_only_context_characters: readonlyChars,
    number_of_writable_files: writableFiles.length,
    number_of_read_only_files: readonlyFiles.length,
    budget_characters: budgetCharacters,
    within_budget: total <= budgetCharacters
  };
}

module.exports = {
  assertCoverage,
  buildCoverage,
  parsePromptContract,
  promptSizeManifest
};
