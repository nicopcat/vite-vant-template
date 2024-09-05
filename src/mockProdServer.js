import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'
import userMock from '../mock/user'
import demoMock from '../mock/demo'
import articleMock from '../mock/article'
import qualityLotMock from '../mock/qualityLot'
import repairLotMock from '../mock/repair'
import maintenanceLotMock from '../mock/maintenance'
export const mockModules = [...userMock, ...demoMock, ...articleMock, ...qualityLotMock, ...repairLotMock ,...maintenanceLotMock]

export function setupProdMockServer(){
  createProdMockServer(mockModules)
}
