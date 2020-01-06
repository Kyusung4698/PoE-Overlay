export interface Release {
    tag_name: string;
    html_url: string;
    assets: ReleaseAsset[];
}

export interface ReleaseAsset {
    browser_download_url: string;
}
