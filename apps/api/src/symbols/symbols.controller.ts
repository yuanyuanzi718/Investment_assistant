import { Controller, Get, Param, Query } from '@nestjs/common';

@Controller('/v1/symbols')
export class SymbolsController {
  @Get('/:symbol/analysis')
  analysis(@Param('symbol') symbol: string, @Query('period') period = '5y') {
    // ✅ MVP：先 mock 一份“可演示的”结构化输出
    return {
      symbol,
      name: symbol === '002371.SZ' ? '北方华创' : symbol,
      market: symbol.endsWith('.HK') ? 'HK' : 'A',
      industry: { code: '801080', name: '电子', cycle_flag: false },
      prev_close: { price: 386.5, date: '2025-12-19' },
      tabs: [
        {
          style_id: 'dividend_cashflow',
          style_name: '股息现金流',
          overall: { score: 72, label: '观察' },
          valuation: { basis: 'PE', percentile: 28, period, zone: '可买' },
          thesis: {
            one_line: '现金流覆盖尚可但稳定性一般，建议观察并等待更稳态证据。',
          },
          metrics: [
            {
              key: 'fcf_cover_div',
              name: 'FCF覆盖分红',
              value: 1.05,
              status: 'yellow',
            },
            {
              key: 'cfo_np',
              name: 'CFO/净利润',
              value: 0.95,
              status: 'yellow',
            },
          ],
          falsify_rules: [
            { rule: 'FCF/分红 < 0.8 连续2期', severity: 'high' },
            { rule: 'CFO/净利润 < 0.8 连续2期', severity: 'high' },
          ],
          logic_chains: [
            {
              conclusion: '分红可持续性待验证',
              because: 'FCF覆盖略高于1但波动较大',
              catalyst: '现金流改善',
              risk: 'Capex上升挤压FCF',
            },
          ],
        },
        {
          style_id: 'prosperity',
          style_name: '景气型',
          overall: { score: 81, label: '适合' },
          valuation: { basis: 'PE', percentile: 28, period, zone: '观察' },
          thesis: {
            one_line:
              '景气兑现强，关注订单与毛利可持续性；估值未到最便宜区间。',
          },
          metrics: [
            {
              key: 'profit_trend',
              name: '利润趋势',
              value: '加速',
              status: 'green',
            },
            {
              key: 'margin_trend',
              name: '毛利率趋势',
              value: '上行',
              status: 'green',
            },
          ],
          falsify_rules: [
            { rule: '利润趋势明显减速 + 毛利率同步下行', severity: 'high' },
            {
              rule: '公告/财报否定关键假设（订单/指引下修）',
              severity: 'high',
            },
          ],
          logic_chains: [
            {
              conclusion: '订单能见度提升',
              because: '研报共识指向需求回升',
              catalyst: '国产替代推进',
              risk: '出口管制风险',
            },
          ],
        },
      ],
    };
  }
}
