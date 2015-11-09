///<reference path="../../mithril.d.ts"/>
///<reference path="../../typings/tsd.d.ts"/>
import * as m from "mithril";
import {ToastService, ToastLevel} from "./toast/ToastService";
import Socket = SocketIOClient.Socket;

class Cell {
    constructor(public value) {

    }
}

class QuartoGrid {
    cells:Cell[] = [];
    rows:Cell[][] = [];

    constructor() {
        for (var i = 0; i < 16; i++) {
            this.cells.push(new Cell(null));
        }

        for (var j = 0; j < 4; j++) {
            var row = [];
            for (var i = 0; i < 4; i++) {
                row.push(this.cells[i + j * 4]);
            }
            this.rows.push(row);
        }
    }
}

class SpielSteine {
    cells:Cell[] = [];
    rows:Cell[][] = [];
    selectedCell;

    constructor() {
        for (var i = 0; i < 16; i++) {
            this.cells.push(new Cell(i));
        }
        for (var j = 0; j < 2; j++) {
            var row = [];
            for (var i = 0; i < 8; i++) {
                row.push(this.cells[i + j * 8]);
            }
            this.rows.push(row);
        }
    }

    selectCell = (cell) => {
        this.selectedCell = cell;
    };

    isSelected = (cell) => {
        return this.selectedCell == cell;
    }
}

enum GameState {
    CHOOSE,
    PLACE
}

class MultiCtrl {
    message = m.prop("");
    messages = [];
    grid = new QuartoGrid();
    stones = new SpielSteine();
    buttonName = "next";
    selected = new Cell(null);
    state = GameState.CHOOSE;

    constructor(private service: ToastService, private socket) {
        socket.on("msg", msg => {
            this.messages.push(msg);
            m.redraw();
            console.log(msg);
        });
    }

    onunload(e) {
        this.socket.removeAllListeners("msg");
    }

    send = (e) => {
        e.preventDefault();
        this.socket.emit("msg", this.message());
        this.service.addToast(this.message(), ToastLevel.SUCCESS);
        this.message("");
    };

    next = () => {
        if (this.state == GameState.CHOOSE) {
            var idx = this.stones.cells.indexOf(this.stones.selectedCell);
            this.stones.cells[idx] = new Cell(null);
            this.selected = this.stones.selectedCell;
            this.state = GameState.PLACE;
        } else if (this.state == GameState.PLACE) {
            var idx = this.grid.cells.indexOf(this.stones.selectedCell);
            this.grid.cells[idx] = this.selected;
            this.selected = new Cell(null);
            this.state = GameState.CHOOSE;
        }

        console.log(this.state);
    };
}

export function multi(service: ToastService, socket: Socket) {
    return {
        controller: function() {
            return new MultiCtrl(service, socket);
        },
        view: function (ctrl) {
            return [
                m(".board", [
                    renderGrid(ctrl),
                    renderStones(ctrl)
                ]),
                m("button", {onclick: ctrl.next}, ctrl.buttonName),
                m("form", {onsubmit: ctrl.send}, [
                    m("ul", ctrl.messages.map(message => m("li", message))),
                    m("input", {oninput: m.withAttr("value", ctrl.message), value: ctrl.message()}),
                    m("button", {type: "submit"}, "send")
                ])
            ];
        }
    };
}

function renderGrid(ctrl:MultiCtrl) {
    return m("div", [
        m(".grid", ctrl.grid.rows.map(renderRow, ctrl)),
        m(".selected-cell", ctrl.selected.value)
    ]);
}

function renderRow(cells) {
    var ctrl:MultiCtrl = this;
    return m(".row", cells.map(cell => m(".cell", {
        onclick: ctrl.stones.selectCell.bind(ctrl, cell),
        "class": ctrl.stones.isSelected(cell) ? "selected" : ""
    }, cell.value)));
}

function renderStones(ctrl:MultiCtrl) {
    return m(".grid", ctrl.stones.rows.map(renderRow, ctrl));
}