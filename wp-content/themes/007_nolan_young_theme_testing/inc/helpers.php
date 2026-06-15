<?php
// Helper functions for the theme
function nolan_young_get_services() {
  return array(
    'custom_web_applications' => 'Custom Web Applications',
    'internal_tools' => 'Internal Tools and Admin Portals',
    'api_integrations' => 'API Integrations',
    'workflow_automation_systems' => 'Workflow Automation Systems',
    'legacy_system_modernization' => 'Legacy System Modernization',
    'technical_discovery' => 'Technical Discovery and Architecture'
  );
}

function nolan_young_get_service_details($service) {
  $services = nolan_young_get_services();
  return isset($services[$service]) ? $services[$service] : 'Unknown Service';
}
