/* eslint-env jest */

const { Lrud } = require('./index')

describe('cancellable movement - functions on the node', () => {
  it('should cancel movement when leaving via shouldCancelLeave on the leave node and fire onCancelled on the node and on the instance', () => {
    const navigation = new Lrud()
    const onCancelledMock = jest.fn()
    const onCancelledNavigationMock = jest.fn()

    navigation.registerNode('root', { orientation: 'horizontal' })
      .registerNode('a', { isFocusable: true })
      .registerNode('b', {
        isFocusable: true,
        shouldCancelLeave: (leave, enter) => {
          if (leave.id === 'b' && enter.id === 'c') {
            return true
          }
        },
        onLeaveCancelled: onCancelledMock
      })
      .registerNode('c', { isFocusable: true })
      .registerNode('d', { isFocusable: true })

    navigation.on('cancelled', onCancelledNavigationMock)

    navigation.assignFocus('b')

    expect(navigation.currentFocusNodeId).toEqual('b')

    navigation.handleKeyEvent({ direction: 'right' })

    expect(navigation.currentFocusNodeId).toEqual('b') // still `b`, as the move should have been cancelled
    expect(onCancelledMock.mock.calls.length).toEqual(1)
    expect(onCancelledNavigationMock.mock.calls.length).toEqual(1)
  })

  it('should cancel movement when entering via shouldCancelEnter on the enter node and fire onCancelled on the node and on the instance', () => {
    const navigation = new Lrud()
    const onCancelledMock = jest.fn()
    const onCancelledNavigationMock = jest.fn()

    navigation.registerNode('root', { orientation: 'horizontal' })
      .registerNode('a', { isFocusable: true })
      .registerNode('b', {
        isFocusable: true,
        shouldCancelEnter: (leave, enter) => {
          if (leave.id === 'a' && enter.id === 'b') {
            return true
          }
        },
        onEnterCancelled: onCancelledMock
      })

    navigation.on('cancelled', onCancelledNavigationMock)
    navigation.assignFocus('a')

    expect(navigation.currentFocusNodeId).toEqual('a')

    navigation.handleKeyEvent({ direction: 'right' })

    expect(navigation.currentFocusNodeId).toEqual('a') // still `b`, as the move should have been cancelled
    expect(onCancelledMock.mock.calls.length).toEqual(1)
    expect(onCancelledNavigationMock.mock.calls.length).toEqual(1)

    // try it again
    navigation.handleKeyEvent({ direction: 'right' })
    expect(onCancelledMock.mock.calls.length).toEqual(2)
    expect(onCancelledNavigationMock.mock.calls.length).toEqual(2)
  })
})
