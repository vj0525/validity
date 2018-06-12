const td = require('testdouble')

describe('app', () => {
  let app
  let tabQueryStub
  let sourceStub
  let checkersStub
  let reportersStub

  beforeEach(() => {
    tabQueryStub = td.func()
    td.replace('../../src/util/browser', () => ({
      tabs: {query: tabQueryStub}
    }))
    sourceStub = td.replace('../../src/source')
    checkersStub = td.replace('../../src/checkers')
    reportersStub = td.replace('../../src/reporters')

    td.when(tabQueryStub({active: true, currentWindow: true})).thenResolve([{
      url: 'https://host/file.html',
      id: 1
    }])
    td.when(sourceStub('https://host/file.html')).thenResolve('<!doctype html>')
    td.when(checkersStub('<!doctype html>')).thenResolve([])

    app = require('../../src/app')
  })

  afterEach(() => {
    td.reset()
  })

  it('returns result of checkers', async () => {
    await app()
    td.verify(reportersStub(1, []))
  })
})
