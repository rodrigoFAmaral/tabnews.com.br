import advertisement from 'models/advertisement';

const mocks = vi.hoisted(() => {
  return {
    query: vi.fn(),
  };
});

vi.mock('infra/database', () => {
  return {
    default: {
      query: mocks.query,
    },
  };
});

describe('models/advertisement.getRandom', () => {
  beforeEach(() => {
    mocks.query.mockReset();
  });

  it('CT1 - should recurse when ownerId yields no results and tryOtherOwners=true', async () => {
    // First call: no rows (owner filter applied)
    mocks.query
      .mockResolvedValueOnce({ rows: [] })
      // Second call: return one ad (no owner filter)
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'ad-other-1',
            slug: 'ad-other-1',
            title: 'Ad from other owner',
            source_url: 'https://example.com',
            owner_username: 'other',
            ad_type: 'markdown',
          },
        ],
      });

    const result = await advertisement.getRandom(1, { ownerId: 'id-dono', tryOtherOwners: true });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('ad-other-1');

    // First query must include the owner_id condition
    expect(mocks.query.mock.calls[0][0].text).toContain("c.owner_id = 'id-dono'");
    // Second query should not include the owner_id FILTER (join still contains 'owner_id')
    expect(mocks.query.mock.calls[1][0].text).not.toContain("c.owner_id = 'id-dono'");
    expect(mocks.query).toHaveBeenCalledTimes(2);
  });

  it('CT2 - should not recurse when tryOtherOwners=false and no results (return empty)', async () => {
    mocks.query.mockResolvedValueOnce({ rows: [] });

    const result = await advertisement.getRandom(1, { ownerId: 'id-dono', tryOtherOwners: false });

    expect(result).toStrictEqual([]);
    expect(mocks.query).toHaveBeenCalledTimes(1);
    expect(mocks.query.mock.calls[0][0].text).toContain("c.owner_id = 'id-dono'");
  });

  it('CT3 - should not recurse when ownerId not provided even if tryOtherOwners=true', async () => {
    mocks.query.mockResolvedValueOnce({ rows: [] });

    const result = await advertisement.getRandom(1, { tryOtherOwners: true });

    expect(result).toStrictEqual([]);
    expect(mocks.query).toHaveBeenCalledTimes(1);
  });

  it('CT4 - should return results when ownerId yields rows (no recursion)', async () => {
    mocks.query.mockResolvedValueOnce({
      rows: [
        {
          id: 'ad-owner-1',
          slug: 'ad-owner-1',
          title: 'Ad owner',
          source_url: 'https://owner.example',
          owner_username: 'owner',
          ad_type: 'markdown',
        },
      ],
    });

    const result = await advertisement.getRandom(1, { ownerId: 'id-dono', tryOtherOwners: true });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('ad-owner-1');
    expect(mocks.query).toHaveBeenCalledTimes(1);
    expect(mocks.query.mock.calls[0][0].text).toContain("c.owner_id = 'id-dono'");
  });

  it('CT5 - should include ignoreId in where clause when provided', async () => {
    mocks.query.mockResolvedValueOnce({
      rows: [
        {
          id: 'ad-any-1',
          slug: 'ad-any-1',
          title: 'Any ad',
          source_url: 'https://any.example',
          owner_username: 'someone',
          ad_type: 'markdown',
        },
      ],
    });

    const result = await advertisement.getRandom(1, { ignoreId: 'id-ignorado' });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('ad-any-1');
    expect(mocks.query).toHaveBeenCalledTimes(1);
    expect(mocks.query.mock.calls[0][0].text).toContain("c.id != 'id-ignorado'");
  });
});
