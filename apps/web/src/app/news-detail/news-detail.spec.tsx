import { render } from '@testing-library/react';

import NewsDetail from './news-detail';

describe('NewsDetail', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NewsDetail />);
    expect(baseElement).toBeTruthy();
  });
});
