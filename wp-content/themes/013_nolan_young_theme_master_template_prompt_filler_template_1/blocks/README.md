# Blocks

This directory contains documentation and resources for custom blocks used in the NOLAN-YOUNG WordPress theme.

## Block Overview

The theme includes several custom blocks designed to enhance content creation and presentation. These blocks are built using the WordPress block editor and can be easily integrated into any post or page within the site.

### Available Blocks

- **Hero Block**: A high-impact hero section with customizable images, headlines, and calls-to-action.
- **Feature Highlight Block**: A versatile block for showcasing key features or services with images, icons, and descriptions.
- **Process Step Block**: Visualize a step-by-step process with icons, numbers, and explanatory text.
- **Testimonial Block**: Display client testimonials with quotes, author names, and profile pictures.

## Usage Instructions

1. **Access the Block Editor**: Navigate to any post or page where you want to add a custom block.
2. **Insert a Block**: Click on the "+" button in the editor toolbar and select the desired custom block from the list of available blocks.
3. **Customize the Block**: Use the block controls (such as text fields, image uploads, and setting adjustments) to customize the appearance and content of the block.

## Customization Tips

- **Consistency**: Maintain a consistent design language across all blocks by adhering to the theme's color scheme and typography styles.
- **Responsiveness**: Ensure that blocks are mobile-friendly and adapt well to various screen sizes.
- **Accessibility**: Make sure that all interactive elements within blocks are keyboard accessible and meet accessibility standards.

## Block Development

If you need to develop or modify custom blocks, refer to the following guidelines:

- **Block Registration**: Use the `register_block_type()` function in your theme's PHP files to register new blocks.
- **JavaScript Setup**: For dynamic block functionality, include JavaScript logic within the block's script file and enqueue it correctly in WordPress.
- **Style Management**: Manage CSS styles for blocks within the theme's SCSS architecture to maintain a consistent look and feel.

## Support

For any issues or questions related to custom blocks, please refer to the [theme documentation](docs/getting-started.md) or contact the theme support team.
