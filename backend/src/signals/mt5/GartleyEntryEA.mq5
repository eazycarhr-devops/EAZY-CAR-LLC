//+------------------------------------------------------------------+
//|                                              GartleyEntryEA.mq5   |
//|                                  Copyright 2026, MADFX-BOSS-MASTER |
//|                                             https://madfxboss.com |
//+------------------------------------------------------------------+
#property copyright "Copyright 2026, MADFX-BOSS-MASTER"
#property link      "https://madfxboss.com"
#property version   "1.00"
#property strict

#include <Trade\Trade.mqh>

//--- Input Parameters
input double   InpLotSize      = 0.1;      // Transaction Lot Size
input double   InpStopLossPips = 30.0;     // Default SL in pips if Fibonacci not used
input double   InpTakeProfitPips = 60.0;   // Default TP in pips if Fibonacci not used
input double   InpRiskReward   = 2.0;       // Risk Reward Ratio for TP
input int      InpMagicNumber  = 123456;   // EA Magic Number

//--- Constants for Gartley
const double GARTLEY_B_RATIO = 0.618;
const double GARTLEY_D_RATIO = 0.786;

//--- Global Variables
CTrade trade;

//+------------------------------------------------------------------+
//| Expert initialization function                                   |
//+------------------------------------------------------------------+
int OnInit()
{
   trade.SetExpertMagicNumber(InpMagicNumber);
   return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| Expert tick function                                              |
//+------------------------------------------------------------------+
void OnTick()
{
   // In a full implementation, this would call the harmonic detection logic
   // derived from backend/src/signals/harmonic.ts
   // Here we implement the ENTRY logic assuming a pattern has been detected.
}

/**
 * Executes the entry based on a detected Gartley pattern.
 * This function should be called by the pattern detection engine.
 * 
 * @param direction 'bullish' for Buy, 'bearish' for Sell
 * @param xPrice   Price of point X
 * @param aPrice   Price of point A
 * @param bPrice   Price of point B
 * @param cPrice   Price of point C
 * @param dPrice   Price of point D (The PRZ start)
 */
void ExecuteGartleyEntry(string direction, double xPrice, double aPrice, double bPrice, double cPrice, double dPrice)
{
   double entryPrice = dPrice;
   double stopLoss = 0;
   double takeProfit = 0;
   
   double xadDiff = Math.abs(xPrice - dPrice);
   double abDiff = Math.abs(aPrice - bPrice);
   
   if(direction == "bullish")
   {
      // Bullish Gartley: Buy at D
      // SL: Usually below X or slightly beyond D extension
      stopLoss = dPrice - (InpStopLossPips * _Point * 10); 
      
      // Fibonacci TP: Target A or B (standard harmonic targets)
      // TP1: 61.8% of AD extension
      double adDiff = Math.abs(aPrice - dPrice);
      takeProfit = dPrice + (adDiff * 0.618);
      
      if(takeProfit <= entryPrice) takeProfit = entryPrice + (InpTakeProfitPips * _Point * 10);
      
      if(!PositionSelectByMagic(InpMagicNumber))
      {
         trade.Buy(InpLotSize, _Symbol, entryPrice, stopLoss, takeProfit, "Gartley Bullish Entry");
      }
   }
   else if(direction == "bearish")
   {
      // Bearish Gartley: Sell at D
      stopLoss = dPrice + (InpStopLossPips * _Point * 10);
      
      double adDiff = Math.abs(aPrice - dPrice);
      takeProfit = dPrice - (adDiff * 0.618);
      
      if(takeProfit >= entryPrice) takeProfit = entryPrice - (InpTakeProfitPips * _Point * 10);
      
      if(!PositionSelectByMagic(InpMagicNumber))
      {
         trade.Sell(InpLotSize, _Symbol, entryPrice, stopLoss, takeProfit, "Gartley Bearish Entry");
      }
   }
}

//+------------------------------------------------------------------+
//| Helper to check for open positions by magic number               |
//+------------------------------------------------------------------+
bool PositionSelectByMagic(long magic)
{
   for(int i=PositionsTotal()-1; i>=0; i--)
   {
      ulong ticket = PositionGetTicket(i);
      if(PositionSelectByTicket(ticket))
      {
         if(PositionGetInteger(POSITION_MAGIC) == magic) return true;
      }
   }
   return false;
}
