const list = () => {
  const result = []
  const total = 9

  for (let i = 1; i <= total; i++) {
    const item = {
      id: '@natural(1, 50)',
      code: '@increment',
      faultReportTime: '@datetime()',
      reportUser: 'xql',
      deviceId: null,
      status: '@pick(["CLOSED", "WAITINGFORCOMFIRM","CANCELED", "ONGOING"])',
      deviceCode: 'A-17',
      deviceName: 'A-17',
      deviceMark: 'A',
      faultReportType: 'shutdown',
      shutdown: '1',
      faultLevel: 'A',
      faultHour: '2',
      faultReportDescription: '',
      repairUser: 'xql',
      reportUserPhone: '12122121',
      shutdownStartTime: '2024-08-13 10:11:02',
      shutdownEndTime: '2024-08-13 10:13:05',
      remark: null,
      acceptanceTime: null,
      repairStartTime: null,
      repairEndTime: null,
      failureCause: '停电导致停机',
      solution: '恢复供电',
    }
    result.push(item)
  }

  return { rows: result, total: total }
}

const detail = () => {
  const item = {
    repair: {
      id: 2,
      code: null,
      faultReportTime: '2024-06-11 08:08:51',
      reportUser: 'nic',
      deviceId: null,
      status: 'CLOSED',
      deviceCode: 'A-5',
      deviceName: 'A-333',
      deviceMark: null,
      faultReportType: 'fault',
      shutdown: '1',
      faultLevel: 'A',
      faultHour: '101318',
      faultReportDescription: '123123',
      repairUser: '38',
      reportUserPhone: '13222222222',
      shutdownStartTime: '2024-06-11 08:08:51',
      shutdownEndTime: '2024-06-12 15:34:52',
      remark: null,
      acceptanceTime: null,
      repairStartTime: null,
      repairEndTime: null,
      failureCause: '111111',
      solution: '22222',
    },
    userList: [],
    partList: [],
  }

  return item
}

const eam_repair_status = () => {
  const result = [
    {
      dictCode: 2262,
      dictSort: 1,
      dictLabel: '待受理',
      dictValue: 'WAITINGFORCOMFIRM',
      dictType: 'eam_repair_status',
      cssClass: null,
      listClass: null,
      isDefault: 'N',
      remark: null,
      createTime: '2024-06-24 14:37:58',
    },
    {
      dictCode: 2267,
      dictSort: 2,
      dictLabel: '待维修',
      dictValue: 'WAITINGFORREPAIR',
      dictType: 'eam_repair_status',
      cssClass: null,
      listClass: null,
      isDefault: 'N',
      remark: null,
      createTime: '2024-06-24 14:37:58',
    },
    {
      dictCode: 2263,
      dictSort: 3,
      dictLabel: '进行中',
      dictValue: 'ONGOING',
      dictType: 'eam_repair_status',
      cssClass: null,
      listClass: null,
      isDefault: 'N',
      remark: null,
      createTime: '2024-06-24 14:37:58',
    },
    {
      dictCode: 2264,
      dictSort: 4,
      dictLabel: '完成',
      dictValue: 'COMPLETED',
      dictType: 'eam_repair_status',
      cssClass: null,
      listClass: null,
      isDefault: 'N',
      remark: null,
      createTime: '2024-06-24 14:37:58',
    },
    {
      dictCode: 2265,
      dictSort: 5,
      dictLabel: '关闭',
      dictValue: 'CLOSED',
      dictType: 'eam_repair_status',
      cssClass: null,
      listClass: null,
      isDefault: 'N',
      remark: null,
      createTime: '2024-06-24 14:37:58',
    },
    {
      dictCode: 2266,
      dictSort: 6,
      dictLabel: '撤销',
      dictValue: 'CANCELED',
      dictType: 'eam_repair_status',
      cssClass: null,
      listClass: null,
      isDefault: 'N',
      remark: null,
      createTime: '2024-06-24 14:37:58',
    },
  ]

  return result
}

export default [
  {
    url: RegExp('/api/eam/EamRepair/list' + '.*'),
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: list(),
      }
    },
  },
  {
    url: RegExp('/api/eam/EamRepair/view/' + '.*'),
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'test',
        data: detail(),
      }
    },
  },
  {
    url: '/api/system/dict/data/type/eam_repair_status',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'test',
        data: eam_repair_status(),
      }
    },
  },
]
