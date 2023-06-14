import React from 'react';
import { useState, useEffect } from 'react';
import './CanvasDrawingModule.scss';

const CanvasDrawingModule = (props) => {
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
	let y = 2;
	let w = 0;
	let h = 0;
	
	function init() {
		const container = document.querySelector('.App');

		canvas = document.getElementById('can');
		canvas.width = container.clientWidth - 10; // 10 is padding left
		canvas.height = container.clientHeight;
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
	}
	
	function color(obj) {
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
	
	function draw() {
		ctx.beginPath();
		ctx.moveTo(prevX, prevY);
		ctx.lineTo(currX, currY);
		ctx.strokeStyle = x;
		ctx.lineWidth = y;
		ctx.stroke();
		ctx.closePath();
	}
	
	function erase() {
		var m = window.confirm("Want to clear");
		if (m) {
			ctx.clearRect(0, 0, w, h);
			document.getElementById("canvasimg").style.display = "none";
		}
	}
	
	function save() {
		document.getElementById("canvasimg").style.border = "2px solid";
		var dataURL = canvas.toDataURL();
		document.getElementById("canvasimg").src = dataURL;
		document.getElementById("canvasimg").style.display = "inline";
	}
	
	function findxy(res, e) {
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

	useEffect(() => {
		init();
	}, [])

	return <div className="cpa__module" id="module--canvas-drawing">
		<canvas id="can" width="400" height="400" style={{border: '2px solid'}}></canvas>
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
}

export default CanvasDrawingModule;
