
export class MenuItem {
    constructor(public href:string, public title:string, public isVisible = () => true) {
    }
}
