export class WebSocketChat {
    name:string
    photo:string
    msg:string

    constructor(name:string, photo:string, msg:string){
        this.name = name;
        this.photo = '../../assets/img/' + photo + '.jpg';
        this.msg = msg;
    }
}
