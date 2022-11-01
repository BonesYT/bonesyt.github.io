/* deprecated */

(function (This) {
    TDCube = function (x=0, y=0, z=0, w=1, h=1, l=1, rx=0, ry=0, rz=0) {
        if (x.x&x.y&x.z&x.w&x.h&x.l&x.rx&x.ry&x.rz) {
            x = x.x
            y = x.y
            z = x.z
            w = x.width
            h = x.height
            l = x.length
            rx = x.rx
            ry = x.ry
            rz = x.rz
        }
        this.x = Number(x)
        this.y = Number(y)
        this.z = Number(z)
        this.rx = Number(rx)
        this.ry = Number(ry)
        this.rz = Number(rz)
        this.width = Number(w)
        this.height = Number(h)
        this.length = Number(l)
    }
    
    var P = {}
    
    P.setPos = function (x, y, z, center = false) {
        if (center) {
            this.x = x - this.width / 2
            this.y = y - this.height / 2
            this.z = z - this.length / 2
        } else {
            this.x = x
            this.y = y
            this.z = z
        }
    }
    P.setSize = function (w=0, h=0, l=0, center = false) {
        if (center) {
            this.x -= (w - this.width) / 2
            this.y -= (h - this.height) / 2
            this.z -= (l - this.length) / 2
        }
        this.width = w
        this.height = h
        this.length = l
    }
    P.setRot = function (rx, ry, rz) {
        this.rx = rx
        this.ry = ry
        this.rz = rz
    }
    P.cngRot = function (rx, ry, rz, cx, cy, cz) {
        var bx = this.x
        var by = this.z
        this.x = x
        this.y = y
        var x = Math.sin(r)
        var y = Math.cos(r)
        var d = Math.sqrt((a.x-bx)**2+(a.y-by)**2)
        a.x -= x*d
        a.y -= y*d
    }
    P.toEdges = function () {
        return new TDCubeEdges(this)
    }
    
    TDCube.prototype = P
    
    function TDCubeEdges(x=0, y=0, z=0, w=1, h=1, l=1, rx=0, ry=0, rz=0) {
        if (x.x&x.y&x.z&x.w&x.h&x.l&x.rx&x.ry&x.rz) {
            x = Number(x.x)
            y = Number(x.y)
            z = Number(x.z)
            w = Number(x.width)
            h = Number(x.height)
            l = Number(x.length)
            rx = Number(x.rx)
            ry = Number(x.ry)
            rz = Number(x.rz)
        }
        this.vertex = [
            []
        ]
    }
})(this)