import { Component, NgZone } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';

let that: HomePage;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  label = '';
  watching = false;
  count = 0;
  id = '';
  constructor(private ngZone: NgZone) {
    that = this;
  }

  async get() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      this.label = JSON.stringify(coordinates);
    } catch (err) {
      this.label = err as string;
    }
  }

  async watch() {
    this.id = await Geolocation.watchPosition({ enableHighAccuracy: true }, this.onPosition);
    this.watching = true;
  }

  onPosition(position: Position | any) {
    that.ngZone.run(() => {
      console.log(position);
      that.count++;
      if (position?.coords) {
        that.label = JSON.stringify(position);
      } else {
        that.label = `Error: ${position}`;
      }
    });
  }

  async stop() {
    await Geolocation.clearWatch({ id: this.id });
    this.watching = false;
  }

}
