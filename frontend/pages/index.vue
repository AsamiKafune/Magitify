<template>
    <div v-if="toggleCreateRoom"
        class="fixed top-0 left-0 z-40 w-full min-h-[calc(100dvh)] flex justify-center items-center bg-black/50 backdrop-blur-sm">
        <div class="bg-black/90 rounded-xl p-4 min-w-[300px]">
            <div class="flex gap-2 justify-between">
                <div>
                    <h1 class="items-center flex text-xl">
                        สร้างห้อง
                    </h1>
                    <p class="text-xs opacity-50">
                        สร้างห้องไว้เปิดเพลงร่วมกัน
                    </p>
                </div>
                <button @click="(() => { toggleCreateRoom = false; })"
                    class="flex items-center justify-center bg-white/10 w-[35px] h-[35px] rounded-lg text-xl text-white">
                    <i class="fas fa-times md:text-base"></i>
                </button>
            </div>
            <div class="grid gap-2 mt-4">
                <div class="relative">
                    <p class="absolute left-4 top-2 text-white/40 text-xs pointer-events-none">username
                    </p>
                    <input type="text" v-model="nickname" class="w-full bg-white/10 pt-5 pb-2 px-4 rounded-xl outline-none">
                </div>
                <button @click="host"
                    class="transition-all active:scale-95 hover:bg-white/90 bg-white text-black py-2 rounded-xl">
                    สร้าง
                </button>
            </div>
        </div>
    </div>
    <div v-if="toggleJoinRoom"
        class="fixed top-0 left-0 z-40 w-full min-h-[calc(100dvh)] flex justify-center items-center bg-black/50 backdrop-blur-sm">
        <div class="bg-black/90 rounded-xl p-4 min-w-[300px]">
            <div class="flex gap-2 justify-between">
                <div>
                    <h1 class="items-center flex text-xl">
                        ค้นหา
                    </h1>
                    <p class="text-xs opacity-50">
                        ค้นหาห้องฟังเพลง
                    </p>
                </div>
                <button @click="(() => { toggleJoinRoom = false; })"
                    class="flex items-center justify-center bg-white/10 w-[35px] h-[35px] rounded-lg text-xl text-white">
                    <i class="fas fa-times md:text-base"></i>
                </button>
            </div>
            <div class="grid gap-2 mt-2">
                <div class="relative">
                    <p class="absolute left-4 top-1 text-xs text-white/40 pointer-events-none">username
                    </p>
                    <div class="flex bg-white/10 rounded-xl px-3">
                        <input type="text" v-model="nickname" maxlength="13"
                            class="w-full pt-5 bg-transparent pb-2 px-1 outline-none">
                    </div>
                </div>
                <div class="relative">
                    <p class="absolute left-4 top-1 text-xs text-white/40 pointer-events-none">ไอดีของห้องเพลง
                    </p>
                    <div class="flex bg-white/10 rounded-xl px-3">
                        <input type="text" v-model="roomInputId" class="w-full pt-5 bg-transparent pb-2 px-1 outline-none">
                    </div>
                </div>
                <button @click="join"
                    class="transition-all active:scale-95 hover:bg-white/90 bg-white text-black py-2 rounded-xl">
                    เข้าห้อง
                </button>
            </div>
        </div>
    </div>
    <div v-if="toggleRoomDetail"
        class="fixed top-0 left-0 z-40 w-full min-h-[calc(100dvh)] flex justify-center items-center bg-black/50 backdrop-blur-sm">
        <div class="bg-black/90 rounded-xl p-4 min-w-[300px]">
            <div class="flex gap-2 justify-between">
                <div>
                    <h1 class="items-center flex text-xl">
                        ห้องฟังเพลง
                    </h1>
                    <p class="text-xs opacity-50">
                        ข้อมูลภายในห้อง
                    </p>
                </div>
                <button @click="(() => { toggleRoomDetail = false; })"
                    class="flex items-center justify-center bg-white/10 w-[35px] h-[35px] rounded-lg text-xl text-white">
                    <i class="fas fa-times md:text-base"></i>
                </button>
            </div>
            <div class="grid gap-1 mt-4 px-3 pb-2">
                <div>
                    <div class="text-xs opacity-30">
                        <i class="fas fa-list"></i> ไอดีห้อง
                    </div>
                    <div class="flex gap-2 justify-between">
                        <div>
                            {{ roominfo.id }}
                        </div>
                        <button @click="clip_(room_url())">
                            <i class="fas fa-clipboard-list-check"></i>
                        </button>
                    </div>
                </div>
                <div>
                    <div class="text-xs opacity-30">
                        <i class="fas fa-users"></i> จำนวนผู้ใช้ในห้อง
                    </div>
                    <div class="flex gap-2 justify-between">
                        <div>
                            {{ roominfo.users.length }} / 99
                        </div>
                    </div>
                </div>
                <div>
                    <div class="text-xs opacity-30">
                        <i class="fas fa-cog"></i> เปิดให้รีเควส?
                    </div>
                    <div class="flex gap-2 justify-between">
                        <div>
                            {{ roominfo.canRequest ? "รีเควสได้" : "ถูกปิดไว้" }}
                        </div>
                        <button @click="toggleRequest" :disabled="!isHost">
                            <i :class="{ 'fas fa-check': roominfo.canRequest, 'fas fa-times': !roominfo.canRequest }"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-if="toggleSearch" class="min-h-[calc(100dvh)] w-full fixed z-[100] bg-black/80 backdrop-blur-sm">
        <div class="grid p-3">
            <div class="flex min-w-[350px] max-w-xl mx-auto">
                <div class="w-full">
                    <input @input="search" ref="input_search" v-model="searchinput" type="text"
                        class="w-full rounded-l-full bg-zinc-700 text-start px-4 outline-none py-2" placeholder="ค้นหาเพลง">
                </div>
                <button @click="toggleSearch = false" class="rounded-r-full bg-zinc-700 w-[50px]">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div
                class="rounded-lg pb-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:max-h-[90svh] max-h-[85svh] mt-5 overflow-y-auto">
                <div v-for="item in searchlist">
                    <div class="bg-zinc-900 rounded-md overflow-clip relative w-full">
                        <img :src="item.img" class="aspect-video object-cover pointer-events-none" alt="thumbnail">
                        <div class="text-start p-3 relative">
                            <div
                                class="flex gap-3 absolute bg-black/60 backdrop-blur-sm top-[-40px] right-0 px-3 py-0.5 rounded-s-xl z-10">
                                <button class="transition-all active:scale-90 hover:opacity-85"
                                    @click="fav(item.id, 'search')">
                                    <i :class="{ 'text-rose-300': favlist.find(e => e.id == item.id) }"
                                        class="fas fa-thumbs-up text-xl"></i>
                                </button>
                                <button class="transition-all active:scale-90 hover:opacity-85" @click="addtoQueue(item)">
                                    <i class="fas fa-plus text-xl"></i>
                                </button>
                            </div>
                            <p class="truncate">
                                {{ item.title }}
                            </p>
                            <div class="text-xs opacity-50 truncate">
                                {{ item.author.name }}
                            </div>
                            <div class="text-xs opacity-50 truncate">
                                {{ item.long }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="min-h-[calc(100dvh)]">
        <div class="min-h-[calc(100dvh)] w-full flex">
            <div
                class="flex justify-center items-center opacity-30 pointer-events-none min-h-[calc(100dvh)] w-full fixed z-[-1]">
                <div class="text-center">
                    <h1 class="text-6xl font-bold">
                        MAGITIFY
                    </h1>
                    <p>
                        BY MAGICLAB
                    </p>
                </div>
            </div>
            <div class="p-3 bg-black/80 w-full pb-[100px]">
                <!-- listmusic -->
                <div class="flex mx-auto max-w-xs">
                    <button :disabled="isJoin && !isHost && !roominfo.canRequest"
                        @click="(() => { toggleSearch = true; focusInput() })"
                        class="flex gap-2 justify-center items-center bg-white/10 w-full py-1 px-2 rounded-xl">
                        <div>
                            {{ (isJoin && !isHost && !roominfo.canRequest) ? "*ปิดการรีเควสเพลง" : "ค้นหาเพลง" }}
                        </div>
                        <i class="far fa-search"></i>
                    </button>
                </div>
                <div v-if="roominfo.queues.length">
                    <div class="mt-4 mb-2 gap-2 flex items-center">
                        <i class="fas fa-clipboard-list"></i>
                        <p>
                            คิวเพลง ({{ roominfo.queues.length }})
                        </p>
                    </div>
                    <div class="rounded-lg pb-2 flex gap-2 overflow-x-auto max-w-full max-h-[120px]">
                        <div v-for="item, idx in roominfo.queues">
                            <div :class="{ 'border-[1.5px] border-purple-400': idx == 0 }"
                                class="bg-zinc-900 rounded-md overflow-clip flex w-[350px] relative shadow-lg">
                                <div v-if="(idx > 0) && ((isJoin && roominfo.canRequest) || isHost || !isJoin)"
                                    class="absolute flex gap-2 bottom-2 bg-black/60 backdrop-blur-sm rounded-r-xl pr-3 ps-2 py-1">
                                    <button class="text-white hover:text-white/80 transition-all active:scale-75"
                                        v-if="(isJoin && isHost) || !isJoin" @click="forcePlay(item.id)">
                                        <i class="fas fa-play"></i>
                                    </button>
                                    <button class="text-white hover:text-white/80 transition-all active:scale-75"
                                        @click="removeQueue(item.id)">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                                <div v-if="idx == 0"
                                    class="absolute flex gap-2 bottom-2 bg-black/60 backdrop-blur-sm rounded-r-xl pr-3 ps-2 py-1">
                                    {{ roominfo.isPlaying ? "กำลังเล่น" : "หยุดชั่วคราว" }}
                                </div>
                                <img :src="item.img" class="aspect-video object-cover object-center" width="150"
                                    alt="thumbnail">
                                <div class="text-start p-3 min-w-[120px]">
                                    <p class="truncate">
                                        {{ item.title }}
                                    </p>
                                    <div class="text-xs opacity-50 truncate">
                                        {{ item.author.name }}
                                    </div>
                                    <div class="text-xs opacity-50 truncate">
                                        {{ item.long }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="favlist.length && toggleSearch == false">
                    <div class="mt-4 mb-2 gap-2 flex items-center">
                        <i class="fas fa-heart"></i>
                        <p>
                            รายการโปรด ({{ favlist.length }})
                        </p>
                    </div>
                    <div
                        class="rounded-lg pb-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                        <div v-for="item in favlist">
                            <div class="bg-zinc-900 shadow-lg rounded-md overflow-clip relative w-full">
                                <img :src="item?.img" class="aspect-video object-cover pointer-events-none" alt="thumbnail">
                                <div class="text-start p-3 relative">
                                    <div
                                        class="flex gap-3 absolute bg-black/60 backdrop-blur-sm top-[-43px] right-0 px-3 py-1 rounded-s-xl ">
                                        <button v-if="((isJoin && roominfo.canRequest) || isHost || !isJoin)"
                                            @click="addtoQueue(item)">
                                            <i class="fas fa-plus text-xl"></i>
                                        </button>
                                        <button @click="fav(item?.id, 'favlist')">
                                            <i class="fas fa-trash text-xl"></i>
                                        </button>
                                    </div>
                                    <p class="truncate">
                                        {{ item?.title }}
                                    </p>
                                    <div class="text-xs opacity-50 truncate">
                                        {{ item?.author.name }}
                                    </div>
                                    <div class="text-xs opacity-50 truncate">
                                        {{ item?.long }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-5 text-center font-thin text-xl" v-if="!roominfo.queues.length && !favlist.length">
                    เริ่มต้น <b>ฟังเพลง</b> ค้นหาเลย!
                </div>
            </div>
        </div>
        <div class="fixed w-full bottom-0 p-4">
            <!-- playerController -->
            <div :class="{ 'h-[0px] -mb-3': !toggleController, 'h-[30px] mb-2': toggleController }"
                class=" flex items-center justify-center text-center overflow-clip transition-all duration-200">

                <div class="flex gap-2">
                    <button v-if="!isJoin" @click="(() => { toggleCreateRoom = true; toggleController = false; })"
                        class="text-white hover:text-white/80 transition-all active:scale-95 flex gap-2 items-center justify-center bg-zinc-800/60 backdrop-blur-sm px-3 py-0.5 rounded-xl">
                        <div class="flex items-center justify-center text-white rounded-xl">
                            <i class="fas fa-plus"></i>
                        </div> สร้าง
                    </button>
                    <button v-if="!isJoin" @click="(() => { toggleJoinRoom = true; toggleController = false; })"
                        class="text-white hover:text-white/80 transition-all active:scale-95 flex gap-2 items-center justify-center bg-zinc-800/60 backdrop-blur-sm px-3 py-0.5 rounded-xl">
                        <div class="flex items-center justify-center text-white rounded-xl">
                            <i class="fas fa-globe-europe"></i>
                        </div> เข้าร่วม
                    </button>
                    <button @click="toggleRoomDetail = true" v-if="isJoin"
                        class="text-white hover:text-white/80 transition-all active:scale-95 flex gap-2 items-center justify-center bg-zinc-800/60 backdrop-blur-sm px-3 py-0.5 rounded-xl">
                        <div class="flex items-center justify-center text-white rounded-xl">
                            <i class="fas fa-headset"></i>
                        </div> ตั้งค่า
                    </button>
                    <button @click="syncmusic()" v-if="isJoin && !isHost"
                        class="text-white hover:text-white/80 transition-all active:scale-95 flex gap-2 items-center justify-center bg-zinc-800/60 backdrop-blur-sm px-3 py-0.5 rounded-xl">
                        <div class="flex items-center justify-center text-white rounded-xl">
                            <i class="fas fa-sync-alt"></i>
                        </div> Sync
                    </button>
                </div>

            </div>
            <div
                class="mx-auto max-w-2xl py-3 ps-3 pr-4 backdrop-blur-sm  bg-zinc-900/90 rounded-xl shadow-xl relative overflow-clip">
                <div :class="{ 'opacity-0': toggleController }"
                    :style="{ width: (roominfo.nowplaying.time.current / roominfo.nowplaying.time.duration * 100) + '%' }"
                    class="bg-white/[0.04] transition-all duration-150 pointer-events-none h-full top-[0px] left-0 absolute">
                </div>
                <div class="flex gap-3 items-center justify-between w-full">
                    <div class="flex gap-3 items-center w-full">
                        <img @click="toggleController = !toggleController"
                            :src="roominfo.queues[0]?.img ?? 'https://dummyimage.com/512x512/fff/000&text=+'"
                            class="max-w-[50px] cursor-pointer  aspect-square object-cover rounded-xl">
                        <button v-if="roominfo.queues[0]" @click="fav(roominfo.nowplaying.data.id, 'queues')">
                            <i :class="{ 'text-rose-300': favlist.find(e => e.id == roominfo.nowplaying.data.id) }"
                                class="fas fa-heart"></i>
                        </button>
                        <div @click="toggleController = !toggleController"
                            class="text-start cursor-pointer  max-w-[120px] sm:max-w-[390px]">
                            <div class="truncate">
                                {{ roominfo.queues[0] ? roominfo.queues[0].title : "ไม่มีเพลงที่กำลังเล่นตอนนี้" }}
                            </div>
                            <div class="text-xs opacity-50 truncate">
                                เพลงถัดไป: {{ roominfo.queues[1] ? roominfo.queues[1].title : "ไม่มี" }}
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-2 w-fit text-2xl">
                        <button class="text-white hover:text-white/80 transition-all active:scale-50"
                            :disabled="(!isHost && isJoin)" @click="loopstate()">
                            <i
                                :class="{ 'fas fa-repeat': roominfo.repeat == 2, 'fas fa-repeat-1-alt': roominfo.repeat == 1, 'fas fa-random': roominfo.repeat == 0 }"></i>
                        </button>
                        <button class="text-white hover:text-white/80 transition-all active:scale-50"
                            :disabled="(!isHost && isJoin)" @click="(() => { if (isHost || !isJoin) { toggleAudio() } })">
                            <i :class="{ 'fas fa-pause': roominfo.isPlaying, 'fas fa-play': !roominfo.isPlaying }"></i>
                        </button>
                        <button class="text-white hover:text-white/80 transition-all active:scale-50"
                            v-if="(isHost && isJoin) || !isJoin"
                            @click="nextQueue(roominfo.repeat == 0 ? false : roominfo.repeat == 2 ? true : false, roominfo.repeat == 1 ? true : false)">
                            <i class="fas fa-forward"></i>
                        </button>
                    </div>
                </div>
                <div :class="{ 'h-[15px]': toggleController, 'h-[0px] -mb-2': !toggleController }"
                    class=" transition-all duration-200 overflow-clip mt-2 flex items-center justify-between gap-2">
                    <div class="gap-2 flex w-full">
                        <div class="min-w-[50px] text-center whitespace-nowrap">
                            {{ timeString(roominfo.nowplaying.time.duration -
                                roominfo.nowplaying.time.current) }}
                        </div>
                        <input :disabled="(isJoin && !isHost)" step="0.01" @input="seek()" min=0
                            v-model="roominfo.nowplaying.time.current" :max="roominfo.nowplaying.time.duration"
                            class="w-full" type="range">
                    </div>
                    <div class="shadow flex gap-2 min-w-[100px] justify-center">
                        <audio controls class="hidden" ref="audio" src="" />
                        <div class="flex items-center justify-center w-[20px]">
                            <i
                                :class="{ 'fad fa-volume': volume > 0.5, 'fad fa-volume-down': volume < 0.5 > 0.1, 'fad fa-volume-mute': volume <= 0 }"></i>
                        </div>
                        <input step="0.01" @input="updateVolume" max=1 min=0 v-model="volume" class="w-full" type="range">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const { $swal } = useNuxtApp()
const swal = $swal.mixin({
    customClass: {
        container: 'bg-black/90 backdrop-blur-sm',
        confirmButton: 'outline-none bg-gradient-to-r px-4 from-pink-400 to-pink-400 text-white rounded-xl p-2 shadow-lg transition-all duration-200 hover:scale-95 text-lg mx-1',
        denyButton: 'outline-none bg-gradient-to-r px-4 from-red-600 to-red-300 text-white rounded-xl p-2 shadow-lg transition-all duration-200 hover:scale-95 text-lg mx-1',
        cancelButton: 'outline-none bg-gradient-to-r px-4 from-pink-600 to-pink-300 text-white rounded-xl p-2 shadow-lg transition-all duration-200 hover:scale-95 text-lg mx-1',
    },
    buttonsStyling: false
})

function showloading() {
    swal.fire({
        html: "<div class=''><h1 class='text-3xl font-bold'>MAGITIFY</h1><p>กำลังรอการตอบสนองจาก SERVER</p></div>",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
            swal.showLoading()
        }
    })
}

const config = useRuntimeConfig().public;

const inviteCode = useRoute().query?.code

import { io } from 'socket.io-client'
const connected = ref(false)
const socket = ref(null);

const toggleController = ref(false);
const toggleRoomDetail = ref(false);
const toggleJoinRoom = ref(false);
const toggleCreateRoom = ref(false);
const favlist = ref([])
const searchlist = ref([])
const searchinput = ref("")
const input_search = ref()
const toggleSearch = ref(false);
let searchTimeout;

const focusInput = () => {
    setTimeout(() => {
        input_search.value.focus();
    }, 50);
};

async function search() {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(async () => {
        if (!searchinput.value.length) return searchlist.value = []
        const { data } = await useFetch(config.api + "/search?q=" + searchinput.value)
        searchlist.value = data.value.data
    }, 300);
}

const audio = ref(null);
const volume = ref(0.15);

const nickname = ref("");
const myid = ref("");

const isHost = ref(false);
const isJoin = ref(false);

const roomInputId = ref("");
const roomId = Date.now().toString(32)
const roominfo = ref({
    id: roomId,
    users: [], //username, socket uid. isOwver
    queues: [],
    isPlaying: false,
    repeat: 2,
    canRequest: true,
    nowplaying: {
        data: {},
        time: {
            current: 0,
            duration: 0,
        }
    }
})

const room_url = () => {
    return window.location.origin + '?code=' + roominfo.value.id
}

onMounted(() => {
    const server = io(config.api)
    server.on('connect', () => {
        connected.value = server.connected;
        socket.value = server;
    });
    server.on('disconnect', () => {
        connected.value = server.connected;
        socket.value = null;
    });
    server.on("create_info", (data) => {
        myid.value = data.yourid
        roominfo.value.users.push({
            name: nickname,
            uid: data.yourid,
            isOwner: true
        })
    })
    server.on("join_info", (data) => {
        //update users in room
        roominfo.value.users = data.users;

        //set join!
        $swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = swal.stopTimer;
                toast.onmouseleave = swal.resumeTimer
            }
        }).fire({
            icon: "success",
            html: "<div><h1 class='text-white/60 font-bold'>NOTIFY</h1><p>" + data.users.find(e => e.uid == data.yourid).name + " เข้าห้องมา</p></div>"
        });

        if (isHost.value || isJoin.value) return;
        myid.value = data.yourid;
        roominfo.value.users = data.users;
        socket.value.emit('send', { invitecode: roomInputId.value, data: { type: "request_sync", userId: myid.value } });
        isJoin.value = true;
    })
    server.on("leave_info", (data) => {

        //set join!
        $swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = swal.stopTimer;
                toast.onmouseleave = swal.resumeTimer
            }
        }).fire({
            icon: "success",
            html: "<div><h1 class='text-white/60 font-bold'>NOTIFY</h1><p>" + roominfo.value.users.find(e => e.uid == data.uid).name + " ออกห้องไปแล้ว</p></div>"
        });
        //update users in room
        roominfo.value.users = data.users;
    })
    server.on("message", (msg) => {
        //host data
        if (isHost.value && isJoin.value && msg.data.userId != myid.value) {
            if (msg.data.type == "request_sync") {
                socket.value.emit('send',
                    {
                        invitecode: roominfo.value.id,
                        data: {
                            type: "respone_sync",
                            room: roominfo.value,
                            toUser: msg.data.userId
                        }
                    });
            }
            if (msg.data.type == "force_sync") {
                socket.value.emit('send',
                    {
                        invitecode: roominfo.value.id,
                        data: {
                            type: "respone_forcesync",
                            room: roominfo.value,
                            action: msg.data.action
                        }
                    });
            }
        }

        //client data
        if (!isHost.value && isJoin.value && msg.data.toUser == myid.value) {
            if (msg.isOwner) {
                //from Host -> selfsync!
                if (msg.data.type == "respone_sync") {
                    stop();
                    if (msg.data.room.isPlaying && msg.data.room.queues[0]) {
                        play(msg.data.room.queues[0], msg.data.room.nowplaying.time.current, "server");
                    }

                    roominfo.value = msg.data.room;
                }
            }
        }

        //from host boardcast
        if (!isHost.value && isJoin.value) {
            if (msg.isOwner) {
                //from owner
                if (msg.data.type == "toggleAudio") {
                    toggleAudio(msg.data.value)
                }
                if (msg.data.type == "respone_forcesync") {
                    const _c = msg.data
                    if (msg.data.action) {
                        stop();
                        if (_c.room.isPlaying && _c.room.queues[0]) {
                            play(_c.room.queues[0], _c.room.nowplaying.time.current, "server");
                        }
                    }
                    roominfo.value = msg.data.room;
                }
                if (msg.data.type == "seek") {
                    seek(msg.data.value)
                }
                if (msg.data.type == "loopstate") {
                    loopstate(msg.data.value)
                }
            }
        }

        //from client boardcast ignore me
        if (isJoin.value && msg.data.ignore != myid.value) {
            if (msg.data.type == "addQueueWithPerm") {
                addtoQueue(msg.data.value, "server")
            }
            if (msg.data.type == "request_play") {
                play(msg.data.value, 0, "server")
            }
            if (msg.data.type == "delQueueWithPerm") {
                removeQueue(msg.data.value, true)
            }
        }
    })
})

//listen toggeter
async function host() {
    if (!nickname.value.length) return;
    isHost.value = true;
    isJoin.value = true;
    toggleRoomDetail.value = true;
    toggleCreateRoom.value = false;

    socket.value.emit('create', { invitecode: roominfo.value.id, name: nickname.value, users: roominfo.value.users });
}

if (inviteCode) {
    toggleJoinRoom.value = true;
    roomInputId.value = inviteCode;
}

async function join() {
    if (!nickname.value.length) return;
    if (!roomInputId.value.length) return;

    const { data } = await useFetch(config.api + "/checkroom/" + roomInputId.value)
    if (data.value.code != 1) return swal.fire({
        html: "<div><h1 class='text-3xl font-bold'>ผิดพลาด</h1><p>ไม่พบไอดีห้องนี้</p></div>",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: (toast) => {
            toast.onmouseleave = swal.resumeTimer
        }
    })

    isHost.value = false;
    toggleRoomDetail.value = true;
    toggleJoinRoom.value = false;
    socket.value.emit('join', { invitecode: roomInputId.value, name: nickname.value });
}

//fav
setTimeout(() => {
    updateFav()
}, 100);

function updateFav() {
    favlist.value = getFav()
}

function getFav() {
    let favorite = localStorage.getItem("favorite")
    if (!favorite) favorite = []
    else favorite = JSON.parse(favorite)

    return favorite
}

function fav(id, type) {
    let favorite = getFav();

    let data;
    if (type == 'search') {
        data = searchlist.value.find(e => e.id == id)
    } else {
        data = roominfo.value.queues.find(e => e.id == id)
    }

    if (favorite.find(e => e.id == id)) {
        favorite = favorite.filter(e => e.id != id)
    } else {
        favorite.push(data)
    }
    localStorage.setItem("favorite", JSON.stringify(favorite))
    updateFav()
}

async function syncmusic() {
    socket.value.emit('send', { invitecode: roomInputId.value, data: { type: "request_sync", userId: myid.value } });
}

async function toggleRequest() {
    roominfo.value.canRequest = !roominfo.value.canRequest
    if (isHost.value && isJoin.value) {
        socket.value.emit('send', { invitecode: roominfo.value.id, data: { type: "force_sync", action: false } });
    }
}

async function removeQueue(id, isServer) {

    if ((isHost.value && isJoin.value) || !isJoin) {
        socket.value.emit('send', { invitecode: roominfo.value.id, data: { type: "force_sync", action: false } });
    } else if (!isHost.value && isJoin.value && roominfo.value.canRequest && !isServer) {
        socket.value.emit('send', { invitecode: roominfo.value.id, data: { type: "delQueueWithPerm", value: id, ignore: myid.value } });
    }


    const queues = roominfo.value.queues
    roominfo.value.queues = queues.filter(e => e.id != id)
}

async function forcePlay(id, isServer) {
    stop()
    let queue = roominfo.value.queues.find(e => e.id == id);
    roominfo.value.queues = roominfo.value.queues.filter(e => e.id != id)
    //force to first!
    roominfo.value.queues = [queue, ...roominfo.value.queues]
    play(queue)
}

async function addtoQueue(song, isServer) {
    if (roominfo.value.queues.find(e => e.id == song.id)) return;

    if (!isServer) {
        showloading()
        const { data } = await useFetch(config.api + "/getsong", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "song": song
            })
        })

        if (data.value?.code != 1) return $swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = swal.stopTimer;
                toast.onmouseleave = swal.resumeTimer
            }
        }).fire({
            icon: "error",
            html: "<div><h1 class='text-white/60 font-bold'>ผิดพลาด</h1><p>เพลงนี้ไม่มีในระบบ</p></div>"
        });
        swal.close()

        if (isHost.value && isJoin.value) {
            //host
            socket.value.emit('send', { invitecode: roominfo.value.id, data: { type: "force_sync", action: false } });
        } else if (!isHost.value && isJoin.value && roominfo.value.canRequest) {
            //client
            socket.value.emit('send', { invitecode: roominfo.value.id, data: { type: "addQueueWithPerm", ignore: myid.value, value: song } });
        }

        //reset values
        searchlist.value = [];
        searchinput.value = "";
        toggleSearch.value = false;
    }
    //node
    $swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = swal.stopTimer;
            toast.onmouseleave = swal.resumeTimer
        }
    }).fire({
        icon: "success",
        html: "<div><h1 class='text-white/60 font-bold'>เพลงถูกเพิ่มในคิว</h1><p>" + song.title.slice(0, 16) + "...</p></div>"
    });

    //force play
    if (!roominfo.value.isPlaying) play(song);

    //added queues
    roominfo.value.queues.push(song)
}

async function stop() {
    //stop current music!
    roominfo.value.isPlaying = false;
    roominfo.value.nowplaying = {
        data: {},
        time: {
            current: 0,
            duration: 0
        }
    }
    if (audio.value) {
        audio.value.pause();
        audio.value.src = null;
        audio.value = null;
    }
}

async function loopstate(value) {
    if (value) {
        value = parseInt(value)
        roominfo.value.repeat = value
    } else {
        roominfo.value.repeat++;
        if (roominfo.value.repeat > 2) roominfo.value.repeat = 0;
        if (isHost.value) {
            socket.value.emit('send', { invitecode: roominfo.value.id, data: { type: "loopstate", value: (roominfo.value.repeat).toString() } });
        }
    }
}

async function nextQueue(save, single) {
    stop();
    if (single) {
        play(roominfo.value.queues[0])
        return;
    }

    if (!roominfo.value.queues[1]) {
        if (!save) {
            roominfo.value.queues = [];
            //หากไม่มีคิวเพลง
            if (isHost.value && isJoin.value) {
                return socket.value.emit('send', { invitecode: roominfo.value.id, data: { type: "force_sync", action: true } });
            }
        }
    }
    if (!save) {
        roominfo.value.queues.shift()
    } else {
        const swap = roominfo.value.queues.shift()
        roominfo.value.queues.push(swap)
    }
    play(roominfo.value.queues[0])
    return;
}

async function play(song, now, isServer) {
    stop()
    //play logic!
    try {
        if (!isServer) {
            showloading()
            const canplay = await recheckfile(song.id)
            if (!canplay) {
                roominfo.value.queues.shift()
                return swal.fire({
                    html: "<div><h1 class='text-3xl font-bold'>พบปัญหา</h1><p>ไม่พบเพลงในฐานข้อมูล</p></div>",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    allowOutsideClick: false,
                    didOpen: (toast) => {
                        toast.onmouseleave = swal.resumeTimer
                    }
                })
            }
        }
        swal.close()

        //play logic
        setTimeout(() => {
            audio.value.src = config.api + "/music/" + song.id + '.mp3'
            roominfo.value.nowplaying = {
                data: song,
                time: {
                    current: audio.value.currentTime,
                    duration: 0,
                }
            }
            roominfo.value.isPlaying = true;
            audio.value.play();
            if (now) audio.value.currentTime = now;
            audio.value.volume = volume.value;

            //boardcast to everyone
            if (isHost.value && isJoin.value) {
                socket.value.emit('send', { invitecode: roominfo.value.id, data: { type: "force_sync", action: true } });
            } if (!isHost.value && isJoin.value && !isServer && roominfo.value.canRequest) {
                socket.value.emit('send', { invitecode: roominfo.value.id, data: { type: "request_play", value: song, ignore: myid.value } });
            }

            audio.value.addEventListener('timeupdate', function () {
                try {
                    roominfo.value.nowplaying.time.current = audio.value.currentTime
                    roominfo.value.nowplaying.time.duration = audio.value.duration
                } catch (error) { }

                if (audio.value) {
                    //next song
                    if (audio.value.currentTime >= audio.value.duration - 1) {
                        if ((isJoin.value && isHost.value) || (!isJoin.value && !isHost.value)) {
                            if (roominfo.value.repeat == 1)
                                return play(song)
                            if (roominfo.value.repeat == 2) {
                                return nextQueue(true)
                            }
                            if (roominfo.value.repeat == 0) {
                                if (!roominfo.value.queues[1]) return swal.fire({
                                    html: "<div><h1 class='text-3xl font-bold'>MAGITIFY</h1><p>คิวเพลงถูกเล่นทั้งหมดแล้ว</p></div>",
                                    icon: "success",
                                    showConfirmButton: false,
                                    timer: 3000,
                                    timerProgressBar: true,
                                    allowOutsideClick: false,
                                    didOpen: (toast) => {
                                        toast.onmouseleave = swal.resumeTimer
                                    }
                                })
                                return nextQueue(false)
                            }
                        }
                    }
                }
            });
        }, 100);
    } catch (error) {
        console.log(error)
        swal.close()
    }
}

//controller
async function updateVolume() {
    if (audio.value) audio.value.volume = volume.value;
    else volume.value = 0.2;
}

async function toggleAudio(value) {
    if (audio.value) {
        if (value) {
            if (value == 'playing') {
                audio.value.play();
                roominfo.value.isPlaying = true;
                return;
            }
            else {
                audio.value.pause();
                roominfo.value.isPlaying = false;
                return;
            }
        } else {
            if (roominfo.value.isPlaying) {
                audio.value.pause();
                roominfo.value.isPlaying = false;
            } else {
                audio.value.play();
                roominfo.value.isPlaying = true;
            }

            if (isHost.value) {
                socket.value.emit('send', { invitecode: roominfo.value.id, data: { type: "toggleAudio", value: roominfo.value.isPlaying ? "playing" : "stoped" } });
            }
        }
    }
}
async function seek(value) {
    if (audio.value) {
        if (value) {
            audio.value.currentTime = value;
            roominfo.value.nowplaying.time.current = value;
        } else {
            audio.value.currentTime = roominfo.value.nowplaying.time.current;
            if (isHost.value) {
                socket.value.emit('send', { invitecode: roominfo.value.id, data: { type: "seek", value: roominfo.value.nowplaying.time.current } });
            }
        }
    } else roominfo.value.nowplaying.time.current = 0;
}

//extension
async function recheckfile(id) {
    try {
        const response = await useFetch(config.api + "/music/" + id + '.mp3')
        if (response.status.value != "success") {
            throw new Error('File not found');
        }
    } catch (error) {
        return false
        //re logic play song
    }
    return true
}

const timeString = (secs) => {
    if (!secs) return "0:00";
    let ss = Math.floor(secs),
        hh = Math.floor(ss / 3600),
        mm = Math.floor((ss - hh * 3600) / 60);
    ss = ss - hh * 3600 - mm * 60;

    if (hh > 0) {
        mm = mm < 10 ? "0" + mm : mm;
    }
    ss = ss < 10 ? "0" + ss : ss;
    return hh > 0 ? `${hh}:${mm}:${ss} ` : `${mm}:${ss}`;
};

const clip_ = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        $swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            didOpen: (toast) => {
                toast.onmouseenter = swal.stopTimer;
                toast.onmouseleave = swal.resumeTimer
            }
        }).fire({
            icon: "success",
            html: "<div><h1 class='text-white/60 font-bold'>สำเร็จ</h1><p>คัดลอกไอดีห้องแล้ว</p></div>"
        });
    } catch (err) {
        swal.fire({
            html: "<div><h1 class='text-3xl font-bold'>ผิดพลาด</h1><p>คัดลอกไม่สำเร็จกรุณาพิมพ์ด้วยตัวเอง</p></div>",
            icon: "error",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: (toast) => {
                toast.onmouseleave = swal.resumeTimer
            }
        })
    }
}
</script>