// Convert Wix image URL to standard HTTPS URL
export const convertWixImageUrl = (url) => {
    console.log('Converting image URL:', url); // Debug log
    
    if (!url) {
        console.log('No URL provided, using placeholder');
        return 'https://via.placeholder.com/400x250/667eea/ffffff?text=No+Image';
    }
    
    // If it's already a full URL, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
        console.log('Already a full URL:', url);
        return url;
    }
    
    // Handle Wix image URLs
    if (url.startsWith('wix:image://')) {
        try {
            const wixUrl = url.replace('wix:image://v1/', '');
            const parts = wixUrl.split('~');
            if (parts.length > 1) {
                const imageUrl = parts[0];
                const imageNameAndSuffix = parts[1].split('/');
                if (imageNameAndSuffix.length > 1) {
                    const suffix = imageNameAndSuffix[0].split('.')[1]; // Extract the file extension
                    const convertedUrl = `https://static.wixstatic.com/media/${imageUrl}~mv2.${suffix}`;
                    console.log('Converted Wix URL:', convertedUrl);
                    return convertedUrl;
                }
            }
        } catch (error) {
            console.error('Error converting Wix URL:', error);
        }
    }
    
    // If it's a relative path, try to make it absolute
    if (url.startsWith('/')) {
        const absoluteUrl = `https://static.wixstatic.com${url}`;
        console.log('Converted relative URL:', absoluteUrl);
        return absoluteUrl;
    }
    
    console.log('Using original URL:', url);
    return url || 'https://via.placeholder.com/400x250/667eea/ffffff?text=No+Image';
};