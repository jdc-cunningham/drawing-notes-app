import React from 'react';
import { useState, useEffect } from 'react';
import './CanvasDrawingModule.scss';
import Pressure from 'pressure';
import RedX from '../../assets/icons/uxwing_close-icon.svg';

const CanvasDrawingModule = (props) => {
	const [menuOpen, setMenuOpen] = useState(false);
	const [activeDrawing, setActiveDrawing] = useState({
		name: 'New drawing',
		id: 0,
		topics: ''
	});
	const [color, setColor] = useState('black');
	const [colorsVisible, setColorsVisible] = useState(false);

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
	var y = 2;
	let w = 0;
	let h = 0;

	const colors = [
		'black',
		'white',
		'red',
		'blue',
		'green',
		'grey'
	];

	const toggleColors = () => {
		setColorsVisible(!colorsVisible);
	}

	const initPressure = () => {
		const pressures = [];

		// reducer
		// https://stackoverflow.com/a/41452260
		const average = array => array.reduce((a, b) => a + b) / array.length;

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
				// this is called every time there is a change in pressure
				// force will always be a value from 0 to 1 on mobile and desktop

				if (pressures.length === 5) {
					pressures.shift();
				}

				pressures.push(Math.floor(force * 5));

				y = average(pressures);
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
		canvas.height = container.clientHeight - header.offsetHeight - 10;
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

	// const color = (obj) => {
	// 	switch (obj.id) {
	// 		case "green":
	// 			x = "green";
	// 			break;
	// 		case "blue":
	// 			x = "blue";
	// 			break;
	// 		case "red":
	// 			x = "red";
	// 			break;
	// 		case "yellow":
	// 			x = "yellow";
	// 			break;
	// 		case "orange":
	// 			x = "orange";
	// 			break;
	// 		case "black":
	// 			x = "black";
	// 			break;
	// 		case "white":
	// 			x = "white";
	// 			break;
	// 	}

	// 	if (x === "white") y = 14;
	
	// 	else y = 2;
	// }

	const draw = () => {
		ctx.beginPath();
		ctx.moveTo(prevX, prevY);
		ctx.lineTo(currX, currY);
		ctx.strokeStyle = color;
		ctx.lineWidth = y;
		ctx.stroke();
		ctx.closePath();
	}

	const erase = () => {
		var m = window.confirm("Want to clear");
		if (m) {
			ctx.clearRect(0, 0, w, h);
		}
	}

	const save = () => {
		var dataURL = canvas.toDataURL();
		console.log(dataURL);
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
				ctx.fillStyle = color;
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
			<button className="canvas-drawing-module__clear-btn" type="button" title="clear drawing" onClick={() => erase()}>
				<img className="canvas-drawing-module__clear-btn-img" src={RedX} alt="clear drawing"/>
			</button>
			<div className={`canvas-drawing-module__active-color ${color} ${colorsVisible ? '' : 'open'}`} onClick={() => toggleColors()} title="click to pick color"></div>
			<div className={`canvas-drawing-module__colors ${colorsVisible ? 'open' : ''}`}>
				{colors.map((color, index) => <div key={index} className={`canvas-drawing-module__color ${color}`} onClick={() => setColor(color)} alt={`use ${color}`}></div>)}
			</div>
		</div>
	)
}

export default CanvasDrawingModule;
