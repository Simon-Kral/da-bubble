import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-channel-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './channel-list.component.html',
  styleUrl: './channel-list.component.scss'
})
export class ChannelListComponent {

  channelList = [
    { name: 'Entwicklerteam', id: '1' },
    { name: 'DevOps', id: '2' },
    { name: 'Smalltalk', id: '3' },
  ]
  selectedChannel: string | null = null;

  constructor(private router: Router) { }

  ngOnInit(): void{
  }

  navigateToChannel(channel: string) {
    this.selectedChannel= channel;
    console.log('Navigating to channel', channel);
    this.router.navigate(['/home/channel']);
  }

}
