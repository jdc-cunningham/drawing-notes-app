import React from 'react';
import { useState, useEffect } from 'react';
import './CanvasDrawingModule.scss';
import Pressure from 'pressure';

const CanvasDrawingModule = (props) => {
	const [menuOpen, setMenuOpen] = useState(false);
	const [activeDrawing, setActiveDrawing] = useState({
		name: 'New drawing',
		id: 0,
		topics: ''
	});

	// variant from basic demo here:
	// https://stackoverflow.com/questions/2368784/draw-on-html5-canvas-using-a-mouse
	let canvas = false;
	let ctx = false;
	let flag = false;
	let prevX = 0;
	let currX = 0;
	let prevY = 0;
	let currY = 0;
	let dot_flag = false;
	let x = "black";
	var y = 2;
	let w = 0;
	let h = 0;

	const initPressure = () => {
		const pressures = [];

		// reducer
		// https://stackoverflow.com/a/41452260
		const average = array => array.reduce((a, b) => a + b) / array.length;

		console.log('init');

		Pressure.set('#canvas', {
			start: function(event){
				// this is called on force start
			},
			end: function(){
				// this is called on force end
			},
			startDeepPress: function(event){
				// this is called on "force click" / "deep press", aka once the force is greater than 0.5
			},
			endDeepPress: function(){
				// this is called when the "force click" / "deep press" end
			},
			change: function(force, event){

				if (pressures.length === 5) {
					pressures.shift();
				}

				pressures.push(Math.floor(force * 5));

				y = average(pressures);

				// this is called every time there is a change in pressure
				// force will always be a value from 0 to 1 on mobile and desktop

				// y = Math.floor(force * 10);
				// y = Math.floor(force * 10);
			},
			unsupported: function(){
				// NOTE: this is only called if the polyfill option is disabled!
				// this is called once there is a touch on the element and the device or browser does not support Force or 3D touch
			}
		});
	}

	const init = () => {
		const container = document.querySelector('.App');
		const header = document.querySelector('.canvas-drawing-module__header');

		canvas = document.getElementById('canvas');
		canvas.width = container.clientWidth - 10; // scrollbar
		canvas.height = container.clientHeight - header.offsetHeight - 8;
		ctx = canvas.getContext("2d");
		w = canvas.width;
		h = canvas.height;

		canvas.addEventListener("mousemove", function (e) {
			findxy('move', e)
		}, false);

		canvas.addEventListener("mousedown", function (e) {
			findxy('down', e)
		}, false);

		canvas.addEventListener("mouseup", function (e) {
			findxy('up', e)
		}, false);

		canvas.addEventListener("mouseout", function (e) {
			findxy('out', e)
		}, false);

		initPressure();
	}

	const loadDrawing = (imgBase64) => {
		// https://stackoverflow.com/a/4409745
		let image = new Image();

		image.onload = function() {
			ctx.drawImage(image, 0, 0);
		};

		image.src = imgBase64;
	}

	const color = (obj) => {
		switch (obj.id) {
			case "green":
				x = "green";
				break;
			case "blue":
				x = "blue";
				break;
			case "red":
				x = "red";
				break;
			case "yellow":
				x = "yellow";
				break;
			case "orange":
				x = "orange";
				break;
			case "black":
				x = "black";
				break;
			case "white":
				x = "white";
				break;
		}

		if (x === "white") y = 14;
	
		else y = 2;
	}

	const draw = () => {
		ctx.beginPath();
		ctx.moveTo(prevX, prevY);
		ctx.lineTo(currX, currY);
		ctx.strokeStyle = x;
		ctx.lineWidth = y;
		ctx.stroke();
		ctx.closePath();
	}

	const erase = () => {
		var m = window.confirm("Want to clear");
		if (m) {
			ctx.clearRect(0, 0, w, h);
			document.getElementById("canvasimg").style.display = "none";
		}
	}

	const save = () => {
		document.getElementById("canvasimg").style.border = "1px solid";
		var dataURL = canvas.toDataURL();
		console.log(dataURL);
		document.getElementById("canvasimg").src = dataURL;
		document.getElementById("canvasimg").style.display = "inline";
	}

	const findxy = (res, e) => {
		if (res === 'down') {
			prevX = currX;
			prevY = currY;
			currX = e.clientX - canvas.offsetLeft;
			currY = e.clientY - canvas.offsetTop;

			flag = true;
			dot_flag = true;

			if (dot_flag) {
				ctx.beginPath();
				ctx.fillStyle = x;
				ctx.fillRect(currX, currY, 2, 2);
				ctx.closePath();
				dot_flag = false;
			}
		}

		if (res === 'up' || res === "out") {
			flag = false;
		}

		if (res === 'move') {
			if (flag) {
				prevX = currX;
				prevY = currY;
				currX = e.clientX - canvas.offsetLeft;
				currY = e.clientY - canvas.offsetTop;
				draw();
			}
		}
	}

	const toggleMenu = () => {
		setMenuOpen(!menuOpen);
	}

	useEffect(() => {
		init();
	}, [])

	return (
		<div className="canvas-drawing-module" id="module--canvas-drawing">
			<div className="canvas-drawing-module__header">
				<button className="canvas-drawing-module__header-toggle-menu-btn" type="button" onClick={() => toggleMenu()}>New</button>
				<h2>{activeDrawing.name}</h2>
				<div className={`canvas-drawing-module__header-menu ${menuOpen ? 'open' : ''}`}>

				</div>
			</div>
			<canvas id="canvas"/>
			{/* <div style="position:absolute;top:12%;left:43%;">Choose Color</div>
			<div style="position:absolute;top:15%;left:45%;width:10px;height:10px;background:green;" id="green" onClick="color(this)"></div>
			<div style="position:absolute;top:15%;left:46%;width:10px;height:10px;background:blue;" id="blue" onClick="color(this)"></div>
			<div style="position:absolute;top:15%;left:47%;width:10px;height:10px;background:red;" id="red" onClick="color(this)"></div>
			<div style="position:absolute;top:17%;left:45%;width:10px;height:10px;background:yellow;" id="yellow" onClick="color(this)"></div>
			<div style="position:absolute;top:17%;left:46%;width:10px;height:10px;background:orange;" id="orange" onClick="color(this)"></div>
			<div style="position:absolute;top:17%;left:47%;width:10px;height:10px;background:black;" id="black" onClick="color(this)"></div> */}
			{/* <div style="position:absolute;top:20%;left:43%;">Eraser</div> */}
			{/* <div style="position:absolute;top:22%;left:45%;width:15px;height:15px;background:white;border:2px solid;" id="white" onClick="color(this)"></div> */}
			<img id="canvasimg" style={{position: 'absolute', top: '10%', left: '52%', display: 'none'}}/>
			<input type="button" value="save" id="btn" size="30" onClick={() => save()} style={{position: 'absolute', top: '55%', left: '10%'}}/>
			<input type="button" value="clear" id="clr" size="23" onClick={() => erase()} style={{position: 'absolute', top: '55%', left: '15%'}}></input>
		</div>
	)
}

export default CanvasDrawingModule;
