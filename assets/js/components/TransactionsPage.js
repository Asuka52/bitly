import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from 'material-ui/Table';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Icon from 'material-ui/Icon';
import Moment from 'react-moment';
import { getAccounts, getTransactions } from '../actions';
import NavTabs from './NavTabs';

class TransactionsPage extends Component {

  state = {
    update: true
  }

  styles = {
    currencyImg: {
      height: '45px',
      width: '45px',
      margin: '20px'
    },
    typeImg: {
    }
  }

  componentDidMount() {
    if (this.props.accounts && this.state.update && !this.props.transactions) {
      this.props.getTransactions(this.props.accounts);
    } else {
      if (!this.props.accounts)
        this.props.getAccounts();
    }
  }

  componentDidUpdate() {
    if (this.props.accounts && !this.props.transactions && this.state.update) {
      this.props.getTransactions(this.props.accounts);
      this.setState({update: false});
    }
  }

  getCurrencyImg(currency) {
    switch (currency) {
      case 'USD':
        return '/images/dollar.png';
      case 'BTC':
        return '/images/bitcoin.png';
      case 'LTC':
        return '/images/litecoin.svg';
      case 'ETH':
        return '/images/ether.png';
    }
  }

  getTypeImg(type) {
    switch (type) {
      case 'buy':
        return '/images/recieve.png';
      case 'sell':
        return '/images/dollar.png';
      case 'send':
        return '/images/send.png';
      case 'fiat_withdrawal':
        return '/images/send.png';
    }
  }

  getPlace(place) {
    switch (place) {
      case 'coinbase':
        return 'Coinbase Exchange'
      case 'address':
        return 'fsfsdf24'
    }
  }

  getDateType(type, date) {
    let msg = null;
    const momentDate = <Moment format="MMM DD YY">{date}</Moment>;
    switch (type) {
      case 'buy':
        msg = 'Recieved';
        break;
      case 'sell':
        msg = 'Sold';
        break;
      case 'send':
        msg = 'Sent';
        break;
      case 'fiat_withdrawal':
        msg = 'Withdrawal';
        break;
      default:
        msg = 'error';
    }
    return (
      <React.Fragment>
        <Typography style={{ fontSize: '14px', fontWeight: 'bold' }}>{msg || 'error'}</Typography>
        <Typography style={{ fontSize: '12px' }}>{momentDate || 'error'}</Typography>
      </React.Fragment>
    )
  }

  getStatus(status) {
    switch (status) {
      case 'pending':
        return (
          <React.Fragment>
            <span style={{ width: '3px', height: '3px', border: '3px solid grey', borderRadius: '3px', display: 'inline-block', marginRight: '2px' }}></span>
            <span>Pending</span>
          </React.Fragment>
        )
      case 'completed':
        return (
          <React.Fragment>
            <span style={{ width: '3px', height: '3px', border: '3px solid green', borderRadius: '3px', display: 'inline-block', marginRight: '2px' }}></span>
            <span>Complete</span>
          </React.Fragment>
        )
    }
  }


  render() {
    const currentTransactions = this.props.transactions ? this.props.transactions.map((transaction) => {
      return (
        <TableRow key={transaction.id}>
          <TableCell style={{ textAlign: 'center' }}>
            <img style={this.styles.typeImg} src={this.getTypeImg(transaction.type)} alt='currency img' />
          </TableCell>
          <TableCell>
            <span>
              {this.getDateType(transaction.type, transaction.created_at)}
              {<Typography>{this.getStatus(transaction.status)}</Typography>}
            </span>
          </TableCell>
          <TableCell style={{ textAlign: 'center' }}>
            <img style={this.styles.currencyImg} src={this.getCurrencyImg(transaction.amount.currency)} alt='currency img' />
          </TableCell>
          <TableCell>
            <Typography style={{ fontSize: '12px' }}>{this.getPlace(transaction.exchange || 'coinbase')}</Typography>
            <Typography style={{ fontSize: '12px', fontWeight: 'bold' }}>{`${transaction.amount.amount} ${transaction.amount.currency}`}</Typography>
            <Typography>{`${transaction.native_amount.amount} ${transaction.native_amount.currency}` || ''}</Typography>
          </TableCell>
          <TableCell>
            <Icon>arrow_drop_down_circle</Icon>
          </TableCell>
        </TableRow>
      )
    }) : <TableRow><TableCell><Typography component='span'>No Transactions</Typography></TableCell></TableRow>;


    return (
      <React.Fragment>
        <AppBar position='static' style={{margin: 0}}>
          <Toolbar disableGutters>
            <span style={{ flex: 1 }}></span>
            <Typography color='secondary' variant='title' style={{ fontSize: '30px' }}>Transactions</Typography>
            <span style={{ flex: 1 }}></span>
          </Toolbar>
        </AppBar>
        <NavTabs />
        <Paper style={{ width: '90%', margin: 'auto' }}>
          <Table>
            <TableBody>
              {currentTransactions}
            </TableBody>
          </Table>
        </Paper>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentState: state,
    transactions: state.transactions,
    wallets: state.wallets,
    accounts: state.accounts
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAccounts: () => dispatch(getAccounts()),
    getTransactions: (accounts) => dispatch(getTransactions(accounts))
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(TransactionsPage);
