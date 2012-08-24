function Renderer(controller) {
    this.controller = controller;
    this.container = undefined;
    this.canvases = new Array();
    this.contexts = new Array();
    this.zoom = 1;
    this.offset = {x:0, y:0}; // offset in world units, not - screen pixels
    this.dimensions = {width:undefined, height:undefined};
    this.initViewport = function() {
        this.container = $('<div class="viewport"></div>');
        $('body').append(this.container);

        this.dimensions = {
          width:this.container.width(),
          height:this.container.height()
        };

        this.addCanvas(); // canvas 0 - do rysowania BH
        this.addCanvas(); // canvas 1 - do rysowania kursora
        this.addCanvas(); // canvas 2 - trajectories

    };

    this.screen2worldCord = function (spos) {
        return {
            x: spos.x/this.zoom - this.dimensions.width/2 - this.offset.x,
            y: spos.y/this.zoom - this.dimensions.height/2 - this.offset.y
        };
    };
    this.world2screenCord = function (wpos) {
        return {
            x: (wpos.x + this.dimensions.width/2 + this.offset.x) * this.zoom,
            y: (wpos.y + this.dimensions.height/2 + this.offset.y) * this.zoom
        };
    };
    this.cart2invPolarCord = function (cpos) {
        return {
            u: 1/Math.sqrt((cpos.x*cpos.x) + (cpos.y*cpos.y)), // u = 1/r
            phi: Math.atan2(cpos.y,cpos.x)  
        };
    };

    this.invPolar2cartCord = function (ipos) {
        return {
            x: Math.cos(ipos.phi) / ipos.u,
            y: Math.sin(ipos.phi) / ipos.u
        }
    };

    this.drawBlackHole = function(rs){
        var ctx = this.contexts[0]
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#00ff00";
        ctx.beginPath();
        var bHposition = this.world2screenCord({x:0, y:0});
        ctx.arc(bHposition.x, bHposition.y, this.zoom * rs, 0, 2 * Math.PI, false);
        ctx.stroke();
    };

    this.addCanvas = function(){

        var n = this.canvases.length;

        this.canvases.push($('<canvas></canvas>'));

        this.canvases[n].css('z-index', 1000+n);
        this.canvases[n].css('position', 'absolute');


        this.canvases[n].attr('width', this.dimensions.width);
        this.canvases[n].attr('height', this.dimensions.height);

        this.container.append(this.canvases[n]);

        this.contexts.push(this.canvases[n][0].getContext('2d'));
    };

    this.drawPinCircle = function(pos){
        var ctx = this.contexts[1];
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#ff0000";
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 35, 0, 2 * Math.PI, false);
        ctx.stroke();
    };

    this.drawPinArrow = function(pin){
        var ctx = this.contexts[1];
        var cR = 100;                           // radius of "r = c" circle
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#ffff00";
        ctx.beginPath();
        ctx.moveTo(pin.pos.x, pin.pos.y);
        ctx.lineTo(
            pin.pos.x + ( cR * pin.v * Math.sin( pin.alpha )),
            pin.pos.y + ( cR * pin.v * Math.cos( pin.alpha ))
        );
        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#777700";
        ctx.beginPath()
        ctx.arc(pin.pos.x, pin.pos.y, cR, 0, 2 * Math.PI, false);
        ctx.stroke();

    };

    this.clearPin = function(){
        this.contexts[1].clearRect(0, 0, this.canvases[1][0].width, this.canvases[1][0].height); // optimize it!
    };

    this.drawTrajectory = function(trajectory){
        var ctx = this.contexts[2];
        this.contexts[2].clearRect(0, 0, this.canvases[2][0].width, this.canvases[2][0].height)
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(trajectory.pin.pos.x, trajectory.pin.pos.y, 5, 0, 2 * Math.PI, false);
        ctx.fillStyle = trajectory.color;
        ctx.fill();
        if( trajectory.points.future.length > 1 ) {
            console.log("rysujemy!");
            this.strokeInvPolarPath(
                trajectory.points.future,
                ctx,
                {
                    lineWidth: 1,
                    lineColor: "#999999"
                }
            )
        }
        // here we will have some strzaleczka drawing
    };

    this.strokeInvPolarPath = function(points, ctx, options){
        ctx.lineWidth = options.lineWidth;
        ctx.strokeStyle = options.lineColor;
        var len = points.length;
        var pnt = undefined;
        ctx.beginPath();
        pnt = this.world2screenCord(this.invPolar2cartCord(points[0]));
        ctx.moveTo(pnt.x, pnt.y);
        for(i = 1; i < len; i++) {
            pnt = this.world2screenCord(this.invPolar2cartCord(points[i]));
            ctx.lineTo(pnt.x, pnt.y)    //maybe points, maybe some spline
        };
        ctx.stroke();
    }
}