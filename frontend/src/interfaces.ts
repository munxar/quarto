
export interface AppConfiguration {
    routeMode: string;
    layout: LayoutConfiguration;
    route: RouteConfiguration;
}

export interface LayoutConfiguration {
    contentId: string;
    menuId: string;
    usersId: string;
    pageId: string;
    toastId: string;
}

export interface RouteConfiguration {
    home: string;
    game: string;
    login: string;
    about: string;
}