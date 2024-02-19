# Avatar

## Description

This project enables users to upload an image for use as their avatar. Should the uploaded image fail to meet the specified criteria, an alert pop-up notification will be displayed, and the image will automatically be adjusted to conform to the following conditions:

- **Size Requirement:** The image must be exactly 512x512 pixels in dimensions.
- **Circle Constraint:** All non-transparent pixels must be contained within a predefined circle.

Additionally, if an image does not embody a 'happy feeling,' an alert pop-up will notify the user.  
An image is deemed to encapsulate a happy feeling if it exhibits a high level of brightness and is primarily composed of warm color tones.

## How to Use

1. Open the project's web interface.
2. Click on the "Upload your avatar" button to select and upload an image from your device.
3. The image will be automatically processed to meet the required conditions and displayed as your avatar.

## Dependencies
No external dependencies are required to run this project locally. All processing is done on the client-side using HTML5, CSS3, and JavaScript.
