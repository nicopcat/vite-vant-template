import BaseCardCom from './src/index.vue'
export const BaseCard = Object.assign(BaseCardCom, {
  install(app){
    app.component(BaseCardCom.name, BaseCardCom)
  }
})

export default BaseCard
