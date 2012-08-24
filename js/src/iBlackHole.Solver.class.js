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
	
		var workData = this.isFuture ? this.trajectory.points.futre : this.trajectory.points.past;
		l = workData.length;
		
		console.log('ilosc punktow:' + l);
		
		if (l>0)
		{
		
		var lastPoint = workData[l-1];
		
		}
		else
		{
		workData.push( this.trajectory.pars.pos0.polar );
		
		            if(Math.tan(trajectory.pin.alpha)>0)
                    {
                         this.trajectory.goingInside = true;
                    }
                    else
                    {
                        this.trajectory.goingInside = false;
                    }
					
					var lastPoint = workData[0];
		}
		var dPhi = 2 * Math.PI / 360;

		console.log('ilosc punktow:' + l + 'znaleziony last point');		
		
		console.log('lpu: ' + lastPoint.u)
        pp = this.trajectory.pars.bInvSq - (lastPoint.u * lastPoint.u) * (1 - this.trajectory.renderer.controller.rs*lastPoint.u);
		
		console.log('testaaa');	
		
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
		
		
			console.log(lastPoint.phi);
		
		     //   if(Math.abs(lastPoint.u)>Math.abs(dU))
             //   {
                workData.push({
                    u:lastPoint.u + dU,
                    phi:lastPoint.phi + dPhi,
                });
            //    }
            //    else
            //    {
            //        this.computed[isFuture?'future':'past']=true;
            //    }
		
	};
}