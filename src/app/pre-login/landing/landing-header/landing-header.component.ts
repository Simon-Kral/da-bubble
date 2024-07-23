import {
	animate,
	group,
	query,
	style,
	transition,
	trigger,
} from '@angular/animations';
import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppComponent } from '../../../app.component';

const enterIntro = transition(':enter', [
	group([
		query('.logo-with-text > img', [
			style({
				marginLeft: 'calc(589px / 2 - 70px)',
			}),
			animate(
				'200ms 500ms',
				style({
					marginLeft: '0',
				})
			),
		]),
		query('.span-wrap > span', [
			style({
				marginLeft: '-500px',
			}),
			animate(
				'300ms 900ms',
				style({
					marginLeft: '0%',
				})
			),
		]),
		query('.logo-with-text', [
			style({
				height: '140px',
				top: 'calc(50vh - 70px)',
				left: 'calc(50% - 589px / 2)',
			}),
			animate(
				'500ms 2.5s',
				style({
					height: '70px',
					top: '0',
					left: '0',
				})
			),
		]),
		query('.span-wrap > span', [
			style({
				fontSize: '90px',
				color: 'white',
			}),
			animate(
				'500ms 2.5s',
				style({
					fontSize: '24px',
					color: 'black',
				})
			),
		]),
		query('.overlay', [
			style({
				opacity: '1',
			}),
			animate(
				'500ms 2.5s',
				style({
					opacity: '0',
				})
			),
		]),
	]),
]);

let intro = trigger('intro', [enterIntro]);

@Component({
	selector: 'app-landing-header',
	standalone: true,
	imports: [RouterLink, NgIf],
	animations: [intro],
	templateUrl: './landing-header.component.html',
	styleUrl: './landing-header.component.scss',
})
export class LandingHeaderComponent implements OnInit {
	introAnimationStarted: boolean = false;
	introAnimationFinished: boolean = false;

	constructor(public appComponent: AppComponent) {}

	/**
	 * Initiates the intro animation.
	 * @returns {void}
	 */
	ngOnInit(): void {
		this.introAnimationStarted = true;
	}

	/**
	 * Callback method that is called when the intro animation is done.
	 * Sets the flag indicating the intro animation has finished to hide the overlay-div.
	 * @returns {void}
	 */
	onAnimationDone(): void {
		this.introAnimationFinished = true;
		this.appComponent.introIsDisabled = true;
	}
}
