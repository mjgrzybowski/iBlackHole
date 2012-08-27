function Controller(doc) {
    this.doc = doc;
    this.renderer = undefined;
    this.trajectories = new Array();
    this.fingerDiff = {x:0,y:0};
    this.fingerDiffAngle = 0;
    this.dragMode = undefined;
    this.init = function () {
        this.renderer = new Renderer(this);
        this.renderer.initViewport();
        this.bindTouchEvents();
        this.rs = 25;
        this.renderer.drawBlackHole(this.rs);
        this.renderer.drawBlackHoleMetric(this.rs);
        this.trajectories.push(new Trajectory({
            pos: {x:200, y:200},
            v: 1,
            alpha: 0.2
        },
            this.renderer
        ));
        this.renderer.drawTrajectory(this.trajectories[0])
    };

    this.bindTouchEvents = function () {
        this.doc.addEventListener("touchstart", this.touchEvent(this));
   //     this.doc.addEventListener("touchend", this.touchEvent(this)); lepiej tak bo przy edzie nieladnie przesuwa pozycje
        this.doc.addEventListener("touchmove", this.touchEvent(this));
    };

    this.dist = function(pos1, pos2){
        return Math.sqrt( Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2) )
    };

    this.touchEvent = function (ctrl) {

        return function (event) {

            event.preventDefault();

            var allTouches = event.touches;

            var touchesPos = new Array();
            var vNew = 1;

            for (touchId in allTouches) {
                if (allTouches[touchId].pageX != undefined) {
                    touchesPos.push({x:allTouches[touchId].pageX, y:allTouches[touchId].pageY});

                }
            }

            var l = touchesPos.length;

            if (l == 0) {
//                ctrl.renderer.clearPin();

            }

            if (l == 1) {



                if (event.type == 'touchstart')
                {
                    ctrl.fingerDiff = posSubtract(ctrl.trajectories[0].pin.pos,touchesPos[0]);
                    ctrl.fingerDiffAngle = Math.atan2(
                            posSubtract(touchesPos[0], ctrl.trajectories[0].pin.pos).y, // uwaga, czy pierwsze x czy y
                            posSubtract(touchesPos[0], ctrl.trajectories[0].pin.pos).x
                        );
                        //- ctrl.trajectories[0].pin.alpha;
                    ctrl.fingerInitialLength = ctrl.dist(touchesPos[0], ctrl.trajectories[0].pin.pos);
                    ctrl.vInitial = ctrl.trajectories[0].pin.v
                  //  console.log('pin.alpha: '+ ctrl.trajectories[0].pin.alpha);
                 //   console.log('firstAngle: '+ Math.atan2(
                 //       posSubtract(touchesPos[0], ctrl.trajectories[0].pin.pos).y,
                 //       -posSubtract(touchesPos[0], ctrl.trajectories[0].pin.pos).x
                  //  ));
                    if (40 > ctrl.dist(touchesPos[0], ctrl.trajectories[0].pin.pos) ) {
                        ctrl.dragMode = "move"
                    }
                    else {
                        ctrl.dragMode = "setVel"
                    }

                }

                if ( ctrl.dragMode == "move" ) {
                    ctrl.trajectories[0].setPosition(posAdd(touchesPos[0],ctrl.fingerDiff));
                    ctrl.renderer.clearPin();
                    ctrl.renderer.drawPinCircle(ctrl.trajectories[0].pin.pos);
                    
			//		ctrl.trajectories[0].points.future = new Array();
                    ctrl.trajectories[0].solver.computeFuturePoints(500);
                    ctrl.trajectories[0].solver.computePastPoints(500);
                    ctrl.renderer.drawTrajectory(ctrl.trajectories[0]);
                }
                else if ( ctrl.dragMode == "setVel" )
                {
				
				
                    vNew = ctrl.vInitial
                        * ctrl.dist(touchesPos[0], ctrl.trajectories[0].pin.pos) / ctrl.fingerInitialLength
                    if (vNew > 1) { vNew = 1}
                    ctrl.trajectories[0].setVelocity(
                        vNew,
                        Math.atan2(
                            posSubtract(touchesPos[0], ctrl.trajectories[0].pin.pos).y,
                            posSubtract(touchesPos[0], ctrl.trajectories[0].pin.pos).x
                        )
                   //  +   ctrl.fingerDiffAngle
                    );
                    ctrl.renderer.clearPin();
					
                    ctrl.renderer.drawPinArrow(ctrl.trajectories[0].pin);
       //             ctrl.trajectories[0].points.future = new Array();
                    ctrl.trajectories[0].solver.computeFuturePoints(500);
                    ctrl.trajectories[0].solver.computePastPoints(500);
                    ctrl.renderer.drawTrajectory(ctrl.trajectories[0]);
					

                };

            }


//            if (l > 1) {
//                ctrl.trajectories[0].setVelocity(touchesPos[0]);
//                ctrl.renderer.clearPin();
//                ctrl.renderer.drawPinCircle(touchesPos[0]);
//                ctrl.renderer.drawTrajectory(ctrl.trajectories[0])
//            }



            if (l > 2) {

            }


        }
    };

}







