import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import PendingOrderScreen from '../screens/PendingOrderScreen.js';
import CompanyDetailsScreen  from '../screens/CompanyDetailsScreen';




export const AppStackNavigator = createStackNavigator({
  PendingOrder : {
    screen : PendingOrderScreen,
    navigationOptions:{
      headerShown : false
    }
  },
  CompanyDetails : {
    screen : CompanyDetailsScreen,
    navigationOptions:{
      headerShown : false
    }
  }
},
  {
    initialRouteName: 'PendingOrder'
  }
);
