type HeaderProps = {
  onLoginClick: () => void
}

export function Header({ onLoginClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-5 py-2 shadow-sm">
      <nav className="hidden w-1/3 flex-row gap-x-6 text-xl md:flex" aria-label="Menu principal">
        <ul className="flex flex-row space-x-6">
          <li>
            <a href="/produtos" className="hover:text-gray-600">
              Produtos
            </a>
          </li>
          <li>
            <a href="#footer" className="hover:text-gray-600">
              Sobre nós
            </a>
          </li>
          <li>
            <a href="/blog" className="hover:text-gray-600">
              Blog
            </a>
          </li>
        </ul>
      </nav>

      <div className="flex flex-1 justify-start md:w-1/3 md:justify-center">
        <a href="/" aria-label="Página inicial da LinguRemi">
          <img
            className="w-40 md:w-62"
            src="/assets/images/logo/LinguRemiLogo.png"
            alt="LinguRemi"
          />
        </a>
      </div>

      <nav className="flex w-auto flex-row justify-end gap-x-6 text-base md:w-1/3 md:text-xl" aria-label="Ações do usuário">
        <ul className="flex flex-row items-center space-x-4 md:space-x-6">
          <li>
            <button
              type="button"
              onClick={onLoginClick}
              className="cursor-pointer hover:text-gray-600"
            >
              Login
            </button>
          </li>

          <li>
            <a href="/" aria-label="Página inicial">
              <img
                src="/assets/icons/Home.png"
                alt=""
                className="h-6 w-6"
              />
            </a>
          </li>

          <li>
            <a href="/carrinho" aria-label="Meu carrinho">
              <img
                src="/assets/icons/carrinho.png"
                alt=""
                className="h-6 w-6"
              />
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}