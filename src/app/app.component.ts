import {Component} from '@angular/core';
import {storeManager} from '../lib/store';
import {globalInitialStore} from '../demo/store';
import {reducerManager} from '../lib/reducer';
import {TestReducer} from '../demo/reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-app';
}

// TODO find best place + revrite to DI or factory
storeManager.init(globalInitialStore);
reducerManager.add(new TestReducer());
