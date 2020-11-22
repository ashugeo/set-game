const isDev = location.hostname === '127.0.0.1' || location.hostname === 'localhost';

// Page title
if (isDev) {
    document.head.removeChild(document.head.getElementsByTagName('title')[0]);

    const title = document.createElement('title');
    title.innerHTML = 'Set Game · dev';
    document.head.appendChild(title);
}

// Manifest
const manifest = document.createElement('link');
manifest.rel = 'manifest';
if (isDev) manifest.href = '/manifest.dev.json';
else manifest.href = '/manifest.json';
document.head.appendChild(manifest);

// Icon links
const links = [
    {
        rel: 'apple-touch-icon',
        sizes: '57x57',
        href: `/img/icons${isDev ? '-dev' : ''}/apple-icon-57x57.png`
    },
    {
        rel: 'apple-touch-icon',
        sizes: '60x60',
        href: `/img/icons${isDev ? '-dev' : ''}/apple-icon-60x60.png`
    },
    {
        rel: 'apple-touch-icon',
        sizes: '72x72',
        href: `/img/icons${isDev ? '-dev' : ''}/apple-icon-72x72.png`
    },
    {
        rel: 'apple-touch-icon',
        sizes: '76x76',
        href: `/img/icons${isDev ? '-dev' : ''}/apple-icon-76x76.png`
    },
    {
        rel: 'apple-touch-icon',
        sizes: '114x114',
        href: `/img/icons${isDev ? '-dev' : ''}/apple-icon-114x114.png`
    },
    {
        rel: 'apple-touch-icon',
        sizes: '120x120',
        href: `/img/icons${isDev ? '-dev' : ''}/apple-icon-120x120.png`
    },
    {
        rel: 'apple-touch-icon',
        sizes: '144x144',
        href: `/img/icons${isDev ? '-dev' : ''}/apple-icon-144x144.png`
    },
    {
        rel: 'apple-touch-icon',
        sizes: '152x152',
        href: `/img/icons${isDev ? '-dev' : ''}/apple-icon-152x152.png`
    },
    {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: `/img/icons${isDev ? '-dev' : ''}/apple-icon-180x180.png`
    },
    {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        href: `/img/icons${isDev ? '-dev' : ''}/android-icon-192x192.png`
    },
    {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: `/img/icons${isDev ? '-dev' : ''}/favicon-32x32.png`
    },
    {
        rel: 'icon',
        type: 'image/png',
        sizes: '96x96',
        href: `/img/icons${isDev ? '-dev' : ''}/favicon-96x96.png`
    },
    {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: `/img/icons${isDev ? '-dev' : ''}/favicon-16x16.png`
    }
]

for (const link of links) {
    const tag = document.createElement('link');
    tag.rel = link.rel;
    if (link.rel === 'icon') tag.type === link.type;
    tag.sizes = link.sizes;
    tag.href = link.href;
    document.head.appendChild(tag);
}