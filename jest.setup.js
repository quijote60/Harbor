jest.mock('react-router-dom', () => {
    return {
      useNavigate: () => jest.fn(),
      Link: ({ children, to }) => <a href={to}>{children}</a>
    };
  });