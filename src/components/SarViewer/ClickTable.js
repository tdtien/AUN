
import React, { Component } from 'react';
import { View, Modal, Button, Text } from 'react-native';
import { HTMLTable,  defaultTableStylesSpecs, cssRulesFromSpecs } from 'react-native-render-html-table-bridge';
import WebView from 'react-native-webview';


const cssRules = cssRulesFromSpecs({
  ...defaultTableStylesSpecs,
  trEvenBackground: '#FFFFFF',
  trOddBackground: '#FFFFFF',
  selectableText: true,
  fitContainer: true
})

const tableConfig = {
  WebViewComponent: WebView,
  cssRules
};

export default class ClickTable extends Component {

  state = {
    modalVisible: false
  }

  render() {
    const { html, numOfRows, numOfColumns, numOfChars } = this.props
    const shouldRenderTableInline = numOfChars < 400 && numOfColumns < 4 && numOfRows < 8
    const description = (
      <Text style={{ fontStyle: 'italic', fontSize: 11, textAlign: 'center' }}>
        This table has {numOfColumns} columns, {numOfRows} rows and contains {numOfChars} readable characters.
        {shouldRenderTableInline ? 'Therefore, it should be rendered inline.' : 'Therefore, it should be rendered in a modal.'}
      </Text>
    )
    if (shouldRenderTableInline) {
      return (
        <View>
          {description}
          <HTMLTable autoheight={true} {...this.props} {...tableConfig} />
        </View>
      )
    }
    return (
      <View>
        {description}
        <Button title="Show table" onPress={() => this.setState({ modalVisible: true })} />
        <Modal visible={this.state.modalVisible}>
          <View style={{ flex: 1, position: 'relative' }}>
            <HTMLTable autoHeight={false}
                       style={{ flex: 1 }}
                       {...this.props}
                       {...tableConfig} />
            <Button title="Close" onPress={() => this.setState({ modalVisible: false })} />
          </View>
        </Modal>
      </View>
    )
  }
}
