import React from 'react';
import { useState, useEffect } from 'react';
import './CanvasDrawingModule.scss';
import Pressure from 'pressure';
import RedX from '../../assets/icons/uxwing_close-icon.svg';
import DrawingMenu from './components/drawing-menu/DrawingMenu';

const CanvasDrawingModule = (props) => {
	const [menuOpen, setMenuOpen] = useState(false);
	const [activeDrawing, setActiveDrawing] = useState({
		name: 'Drawing title',
		id: 0,
		topics: '',
	});
	const [color, setColor] = useState('');
	const [colorsVisible, setColorsVisible] = useState(false);
	const [drawStarted, setDrawStarted] = useState(false); // specifically for colors
	const [savingState, setSavingState] = useState('not saved'); // saving, saved
	const [triggerSave, setTriggerSave] = useState(false);

	// variant from basic demo here:
	// https://stackoverflow.com/questions/2368784/draw-on-html5-canvas-using-a-mouse
	let canvas = false;
	var ctx = false;
	let flag = false;
	let prevX = 0;
	let currX = 0;
	let prevY = 0;
	let currY = 0;
	let dot_flag = false;
	var y = 2;

	const colors = [
		'black',
		'white',
		'red',
		'blue',
		'green',
		'gray'
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
				if (!drawStarted) {
					setDrawStarted(true);
				}
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

	const getCtx = () => {
		return document.getElementById('canvas').getContext("2d");
	}

	const setCanvasSize = () => {
		const container = document.querySelector('.App');
		const header = document.querySelector('.canvas-drawing-module__header');

		canvas = document.getElementById('canvas');
		canvas.width = container.clientWidth - 10; // scrollbar
		canvas.height = container.clientHeight - header.offsetHeight - 10;
	}

	const init = () => {
		const container = document.querySelector('.App');
		const header = document.querySelector('.canvas-drawing-module__header');

		canvas = document.getElementById('canvas');
		canvas.width = container.clientWidth - 10; // scrollbar
		canvas.height = container.clientHeight - header.offsetHeight - 10;
		ctx = canvas.getContext("2d");

		canvas.addEventListener("mousemove", function (e) {
			findxy('move', e)
		}, false);

		canvas.addEventListener("mousedown", function (e) {
			findxy('down', e)
		}, false);

		canvas.addEventListener("mouseup", function (e) {
			findxy('up', e)
			setTriggerSave(true);
		}, false);

		canvas.addEventListener("mouseout", function (e) {
			findxy('out', e)
		}, false);

		initPressure();
	}

	const draw = () => {
		ctx.beginPath();
		ctx.moveTo(prevX, prevY);
		ctx.lineTo(currX, currY);
		ctx.lineWidth = y;
		ctx.stroke();
		ctx.closePath();
	}

	const erase = () => {
		var m = window.confirm("Want to clear");
		if (m) {
			// still referring to init 0 values
			let canvas = document.getElementById('canvas');
			getCtx().clearRect(0, 0, canvas.width, canvas.height);
		}
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

	const getCanvas = () => document.getElementById('canvas');

	useEffect(() => {
		if (color) {
			getCtx().strokeStyle = color;
			toggleColors();
		}
	}, [color])

	useEffect(() => {
		init();

		window.addEventListener('resize', function(event) {
			setCanvasSize();
		}, true);
	}, [])

	return (
		<div className="canvas-drawing-module" id="module--canvas-drawing">
			<div className="canvas-drawing-module__header">
				<button className="canvas-drawing-module__header-toggle-menu-btn" type="button" onClick={() => toggleMenu()}>Menu</button>
				<h2>{activeDrawing.name}</h2>
				<DrawingMenu
					canvas={getCanvas()}
					menuOpen={menuOpen}
					setMenuOpen={setMenuOpen}
					activeDrawing={activeDrawing}
					setActiveDrawing={setActiveDrawing}
					setSavingState={setSavingState}
					erase={erase}
					triggerSave={triggerSave}
					setTriggerSave={setTriggerSave}
				/>
			</div>
			<canvas id="canvas"/>
			<button className="canvas-drawing-module__clear-btn" type="button" title="clear drawing" onClick={() => erase()}>
				<img className="canvas-drawing-module__clear-btn-img" src={RedX} alt="clear drawing"/>
			</button>
			<div className={`canvas-drawing-module__active-color ${color} ${colorsVisible ? '' : 'open'}`} onClick={() => toggleColors()} title="click to pick color"></div>
			<div className={`canvas-drawing-module__colors ${colorsVisible ? 'open' : ''}`}>
				<div className="canvas-drawing-module__colors-container">
					{colors.map((color, index) => <div key={index} className={`canvas-drawing-module__color ${color}`} onClick={() => setColor(color)} alt={`${color}`} title={`use ${color}`}></div>)}
				</div>
			</div>
      <div className="DrawingMenu__saving-state">{savingState}</div>
		</div>
	)
}

export default CanvasDrawingModule;
