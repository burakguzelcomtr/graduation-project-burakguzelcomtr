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

    completeQuiz(materialId) {
      if (!materialId || !socket.connected) {
        return
      }

      socket.emit('complete quiz', materialId)
    },

    completeUnit(unitId) {
      if (!unitId || !socket.connected) {
        return
      }

      socket.emit('complete unit', unitId)
    },

    showStudentActivityToast(payload) {
      const type = payload?.type
      const student = (payload?.studentName ?? [payload?.student?.name, payload?.student?.surname].filter(Boolean).join(' ')) || 'A student'
      const target = payload?.targetTitle ?? payload?.material?.title ?? payload?.unit?.title ?? 'Unknown'

      const messageNode = (() => {
        if (type === 'material-started') return h('span', [h('strong', student), ' joined ', h('strong', target)])
        if (type === 'unit-started') return h('span', [h('strong', student), ' started ', h('strong', target), ' unit'])
        if (type === 'quiz-completed') return h('span', [h('strong', student), ' completed the ', h('strong', target), ' quiz ✅'])
        if (type === 'unit-completed') return h('span', [h('strong', student), ' completed the ', h('strong', target), ' unit 🎉'])
        return h('span', [h('strong', student), ' did something in ', h('strong', target)])
      })()

      const toastFn = (type === 'quiz-completed' || type === 'unit-completed') ? toast.success : toast.info

      toastFn(() => messageNode, {
        autoClose: 6000,
        closeOnClick: true,
        position: 'top-right',
      })
    },
  },
})