import {defineStore} from 'pinia';
import {ref} from 'vue';
import {creteEcho} from '@/plugins/echo';


export const useEchoStore = defineStore('echo', () => {
  const echo = ref(null);

  function initEcho(token) {
    if (!echo.value) {
      echo.value = creteEcho(token);
    }
  }

  function leaveChannel(channelName) {
    if (echo.value) {
      echo.value.leave(channelName);
    }
  }

  return {initEcho, leaveChannel, echo};
}
);