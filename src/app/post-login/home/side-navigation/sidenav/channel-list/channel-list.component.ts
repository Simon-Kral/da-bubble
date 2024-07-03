import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Firestore, collection, onSnapshot, orderBy, query } from '@angular/fire/firestore';
import { Channel } from '../../../../../models/channel.class';

@Component({
  selector: 'app-channel-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './channel-list.component.html',
  styleUrl: './channel-list.component.scss'
})
export class ChannelListComponent implements OnInit, OnDestroy{

  firestore: Firestore = inject(Firestore);

  channelList: Channel[] = [];
  channel = new Channel();
  unsubscribeChannelList: any;


  selectedChannel: string | null = null;

  constructor(private router: Router) { }

  ngOnInit(): void{
    this.subChannelsList();

  }

  ngOnDestroy(): void{
    if (this.unsubscribeChannelList){
      this.unsubscribeChannelList();
    }
  }

  navigateToChannel(channel: string) {
    this.selectedChannel= channel;
    console.log('Navigating to channel', channel);
    this.router.navigate(['/home/channel']);
  }

  subChannelsList() {
    const q = query(this.getChannelsRef(), orderBy('name'));
    this.unsubscribeChannelList = onSnapshot(q, (snapshot) => {
      this.channelList = [];
      snapshot.forEach(doc => {
        this.channelList.push(this.setChannel(doc.data(), doc.id));
      });
      console.log('Channel List:', this.channelList);
    }, (error) => {
      console.error("Error fetching channels: ", error);
    });
  }

  getChannelsRef() {
    return collection(this.firestore, 'channels');
  }

  setChannel(obj: any, id: string,): Channel {
    return {
      chanId: id || "",
      name: obj.name || "",
      description: obj.description || "",
      members: obj.members || [],
      messages: obj.messages || [],
      createdAt: obj.createdAt || "",
      createdBy: obj.createdBy || "",
    }
  }

}
