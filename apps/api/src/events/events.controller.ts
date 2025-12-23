import { Controller, Get, Query } from '@nestjs/common';

/**
 * 证伪事件流（MVP）
 * - status=unreviewed：返回“待复盘”
 * - status=all：返回全部（可选）
 */
@Controller('/v1/events')
export class EventsController {
  @Get('/falsify')
  falsify(
    @Query('status') status: 'unreviewed' | 'all' = 'unreviewed',
    @Query('limit') limitStr = '20',
  ) {
    const limit = Math.min(Number(limitStr) || 20, 50);

    // ✅ mock 事件：后面接“研报观点变化 / 财报要点 / 公告”后就在这里产出事件
    const all = [
      {
        event_id: 'e_002371_1',
        symbol: '002371.SZ',
        style_id: 'prosperity',
        confidence: 'high',
        falsified_hypothesis: '订单能见度持续提升（关键假设被证伪）',
        evidence: {
          type: 'announcement',
          source: '公司公告摘要',
          date: '2025-12-20',
          summary: '公告指引下修，核心产品订单增长低于预期。',
        },
        action_suggestion: [
          '更新核心假设',
          '等待下一次订单/指引验证',
          '若风险偏好低可降低仓位',
        ],
        status: 'unreviewed',
      },
      {
        event_id: 'e_00700_1',
        symbol: '00700.HK',
        style_id: 'dividend_cashflow',
        confidence: 'medium',
        falsified_hypothesis: '现金流稳定性维持（关键假设受挑战）',
        evidence: {
          type: 'report',
          source: '公开研报摘要',
          date: '2025-12-18',
          summary: '研报提示某业务线利润承压，短期自由现金流波动可能放大。',
        },
        action_suggestion: [
          '复核现金流口径',
          '关注资本开支变化',
          '设置更严格的证伪阈值',
        ],
        status: 'unreviewed',
      },
      {
        event_id: 'e_old_reviewed',
        symbol: '002371.SZ',
        style_id: 'dividend_cashflow',
        confidence: 'medium',
        falsified_hypothesis: '分红可持续性改善',
        evidence: {
          type: 'financial',
          source: '财报摘要',
          date: '2025-11-01',
          summary: '现金流覆盖分红改善，但仍需观察。',
        },
        action_suggestion: ['继续观察'],
        status: 'reviewed',
      },
    ];

    const filtered =
      status === 'unreviewed'
        ? all.filter((x) => x.status === 'unreviewed')
        : all;
    return { items: filtered.slice(0, limit) };
  }
}
