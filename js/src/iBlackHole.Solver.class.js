function Solver(trajectory) {
    this.trajectory = trajectory;
	this.computed = {past:false,future:false};
    this.computeFuturePoints = function(n){
        for (i = 0; i < n ; i++)
        {
            this.computePoint(true);
        }
    };
    this.computePastPoints = function(n){
        for (i = 0; i < n ; i++)
        {
            this.computePoint(false);
        }
    };
    this.computePoint = function(isFuture){
		workData = isFuture ? this.trajectory.points.futre : this.trajectory.points.past;
		l = workData.length;
		
		if (l>0)
		{
		lastPoint = workData[length-1];
		}
		else
		{
		workData.push( this.trajectory.pars.pos0.polar );
		
		            if(Math.tan(ray.pin.alpha)>0)
                    {
                         this.trajectory.goingInside = true;
                    }
                    else
                    {
                        this.trajectory.goingInside = false;
                    }
		}
		var dPhi = 2 * Math.PI / 360;

        pp = this.trajectory.pars.bInvSq - (lastPoint.u * lastPoint.u) * (1 - this.trajectory.renderer.controller.rs*lastPoint.u);
		
		        if(pp<0)
                {
                    if( this.trajectory.goingInside )
                    {
                        this.trajectory.goingInside = false;
                    }
                    else
                    {
                        this.trajectory.goingInside = true;
                    }
                    pp = -pp;
                }

                if( this.trajectory.goingInside){
                    dU = Math.sqrt(pp) * dPhi;
                }
                else
                {
                    dU = -1*Math.sqrt(pp) * dPhi;
                }
		
		        if(Math.abs(lastPoint.sigma)>Math.abs(dSigma))
                {
                this.workData.push({
                    u:lastPoint.u + dU,
                    phi:lastPoint.phi + dPhi,
                });
                }
                else
                {
                    this.computed[isFuture?'future':'past']=true;
                }
		
	};
}