import { Madoi } from "madoi-client";
import { Room } from "./vroom";
import { madoiKey, madoiUrl } from './keys';

window.addEventListener("load", function () {
    const m = new Madoi(`${madoiUrl}/vroom-narlko4iw`, madoiKey);
    const room = new Room("#svg", 800, 600);
    const name = localStorage.getItem("name");
    m.register(room);
    m.addEventListener("enterRoomAllowed", ({detail: {selfPeer}}) =>{
        const avator = room.newAvator(
            selfPeer.id,
            name != null ? name : "匿名",
            Math.random() * 300, Math.random() * 300);
        avator?.getCircle().attr({fill: '#0fa'});
        avator?.getGroup().draggable().on('dragmove', (e: any) => {
            const { handler, box } = e.detail;
            room.setPosition(selfPeer.id, box.x + box.width / 2, box.y + box.height / 2);
        });

        // ダブルクリックで名前変更
        let lastClick = new Date().getTime();
        avator?.getGroup().click(()=>{
            const t = new Date().getTime();
            if(t - lastClick < 300){
                const newName = window.prompt("名前を入力してください", avator.getName());
                if(newName){
                    avator.setName(newName);
                    room.changeName(selfPeer.id, newName);
                    localStorage.setItem("name", newName);
                }
            }
            lastClick = t;
        });
    });
});
