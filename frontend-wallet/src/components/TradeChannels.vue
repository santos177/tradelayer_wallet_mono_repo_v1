<template>
    <md-table md-card>
        <md-table-row> 
              <md-table-cell> 
              <md-icon>offline_bolt</md-icon>
              <md-tooltip md-direction="top">Margin Balance</md-tooltip>
            </md-table-cell>
            <md-table-cell> 
              <md-icon>chat_bubble_outline</md-icon>
              <md-tooltip md-direction="top">Quote Price</md-tooltip>
            </md-table-cell>
            <md-table-cell> 
              <md-icon>menu_book</md-icon>
              <md-tooltip md-direction="top">Unpublished Trade Size</md-tooltip>
            </md-table-cell>
                 <md-table-cell> 
              <md-icon>person</md-icon>
              <md-tooltip md-direction="top">address</md-tooltip>
            </md-table-cell>
        </md-table-row>

        <md-table-row  v-for="(channel) in channels"  v-bind:key="channel.address">
            <md-table-cell>{{channel.marginBalance}}</md-table-cell>                       
            <md-table-cell>{{channel.quotePrice}} </md-table-cell>
            <md-table-cell>{{channel.unpublishedTradeSize}} </md-table-cell>
            <md-table-cell>{{channel.address}} </md-table-cell>
        </md-table-row>

    </md-table>
 
</template>
<script>
import socket from '../socket/socketconnect.js'
export default {
  name: "TradeChannels",
  data() {
    const dummyChannels = [
        {
          marginBalance: 1,
          quotePrice: 2,
          unpublishedTradeSize: 3,
          address: "0xdanielgoldman",
          id: 123
        },
        {
          marginBalance: 4,
          quotePrice: 5,
          unpublishedTradeSize: 6,
          address: "0xsatoshinakamoto",
          id: 456
        }
      ]
    return {
      channels: dummyChannels
    };
  },
  mounted(){
    socket.on('receiveChannelProposal', (data)=>{
      const channelData = (({ marginBalance, quotePrice, unpublishedTradeSize, address, id }) => ( 
        {marginBalance, quotePrice, unpublishedTradeSize, address, id }
        ))(data);
        this.channels.push(channelData)
      
  
    })
  }
};
</script>