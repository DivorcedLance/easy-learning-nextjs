export function calculateDimensions(height: number, width: number, maxHeight: number, maxWidth: number | null) {
    let newHeight = height;
    let newWidth = width;
    
    if (maxWidth && width > maxWidth) {
        newWidth = maxWidth;
        newHeight = (newWidth * height) / width;
    }
    
    if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = (newHeight * width) / height;
    }
    
    return { height: newHeight, width: newWidth };
}