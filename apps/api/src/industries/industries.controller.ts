import { Controller, Get, Param } from '@nestjs/common';

@Controller('/v1/industries')
export class IndustriesController {
  @Get('/rank')
  rank() {
    return {
      market: 'A+HK',
      period: '5y',
      items: [
        {
          industry_code: '801080',
          industry_name: '电子',
          cycle_flag: false,
          valuation_basis: 'PE',
          cheapness_percentile: 12,
          cheapness_label: '极便宜',
        },
      ],
    };
  }

  @Get('/:code')
  detail(@Param('code') code: string) {
    return {
      industry_code: code,
      industry_name: code === '801080' ? '电子' : `行业${code}`,
      cycle_flag: false,
      valuation_basis: 'PE',
      cheapness_percentile: 12,
      cheapness_label: '极便宜',
      research_summary: [
        { point: '国产替代推进，景气回升迹象增强' },
        { point: '订单能见度提升，关注盈利质量改善' },
        { point: '风险：海外限制与下游资本开支波动' },
      ],
      symbols: [
        {
          symbol: '002371.SZ',
          name: '北方华创',
          market: 'A',
          valuation_percentile: 28,
          one_line_reason:
            '景气兑现强，关注订单与毛利可持续性；估值未到最便宜区间。',
          style_fit: {
            dividend_cashflow: { score: 72, label: '观察' },
            prosperity: { score: 81, label: '适合' },
          },
        },
        {
          symbol: '00700.HK',
          name: '腾讯控股',
          market: 'HK',
          valuation_percentile: 35,
          one_line_reason: '现金流强，估值回到合理区间，关注广告/游戏修复。',
          style_fit: {
            dividend_cashflow: { score: 85, label: '适合' },
            prosperity: { score: 60, label: '观察' },
          },
        },
      ],
    };
  }
}
