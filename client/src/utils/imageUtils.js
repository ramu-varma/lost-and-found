export const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    // If it's a relative path from our backend
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const hostname = window.location.hostname;
    return `http://${hostname}:5000${normalizedPath}`;
};
