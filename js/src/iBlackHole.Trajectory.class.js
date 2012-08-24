function Trajectory(pin,renderer){
    this.renderer = renderer;
	this.solver = new Solver(this);
    this.pin = pin;
    this.color = "#ffffff";
    this.points = {past: [], future: []};
    this.pars = {
        pos0: {
            cart : {x:undefined, y:undefined},
            polar : {r:undefined,phi:undefined,u:undefined}
        },
        L: undefined,   // angular momentum;    currently unsupported
        E: undefined,   // energy;              currently unsupported
        vPerp:undefined, // perpendicular velocity
        aInvSq: undefined,   // aInvSq = 1/(a*a);       a = L / (m * c);         for photons aInvSq = 0
        bInvSq: undefined,   // bInvSq = 1/(b*b);       b = L * c / E;           c = 1
    };
    this.updatePars = function(){

        this.pars.pos0.cart = this.renderer.screen2worldCord(this.pin.pos);
        this.pars.pos0.polar = this.renderer.cart2invPolarCord(this.pars.pos0.cart);

        this.pars.vPerp = this.pin.v * Math.sin (this.pin.alpha - this.pars.pos0.polar.phi);

        this.pars.aInvSq = (1 - this.pin.v) * Math.pow( 1 / this.pars.vPerp, 2);
        this.pars.bInvSq = 1 / Math.pow(( 1/this.pars.pos0.polar.u )* this.pars.vPerp, 2);
    }
    this.setPosition = function(pos){
        this.pin.pos.x = pos.x;
        this.pin.pos.y = pos.y;
        this.updatePars()
    };
    this.setVelocity = function(v, angle){
        this.pin.v = v;
        this.pin.alpha =  angle;
        this.updatePars()
    }
}