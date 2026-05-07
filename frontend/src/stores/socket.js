import { defineStore } from 'pinia'
import { h } from 'vue'
import { io } from 'socket.io-client'
import { toast } from 'vue3-toastify'

export const socket = io('/', {
  autoConnect: false,
  path: '/socket.io',
  withCredentials: true,
})

export const useSocketStore = defineStore('Socket', {
  state: () => ({
    connected: false,
    initialized: false,
  }),
  actions: {
    init() {
      if (this.initialized) {
        return
      }

      this.initialized = true

      socket.on('connect', () => {
        this.connected = true
        console.log('connected')
      })

      socket.on('disconnect', () => {
        this.connected = false
        console.log('disconnected')
      })

      socket.on('student activity', (payload) => {
        this.showStudentActivityToast(payload)
      })
    },

    connect() {
      if (!socket.connected) {
        socket.connect()
      }
    },

    disconnect() {
      if (socket.connected) {
        socket.disconnect()
      }

      this.connected = false
    },

    startUnit(unitId) {
      if (!unitId || !socket.connected) {
        return
      }

      socket.emit('start unit', unitId)
    },

    startMaterial(materialId) {
      if (!materialId || !socket.connected) {
        return
      }

      socket.emit('start material', materialId)
    },

    showStudentActivityToast(payload) {
      const isMaterial = payload?.type === 'material-started'
      const student = (payload?.studentName ?? [payload?.student?.name, payload?.student?.surname].filter(Boolean).join(' ')) || 'A student'
      const target = payload?.targetTitle ?? payload?.material?.title ?? payload?.unit?.title ?? (isMaterial ? 'Material' : 'Unit')

      toast.info(() => (isMaterial
        ? h('span', [h('strong', student), ' joined ', h('strong', target)])
        : h('span', [h('strong', student), ' join ', h('strong', target), ' Unit'])), {
        autoClose: 5000,
        closeOnClick: true,
        position: 'top-right',
      })
    },
  },
})