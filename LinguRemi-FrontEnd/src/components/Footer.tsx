import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer
      id="footer"
      className="bg-linear-to-br from-gray-500 from-1% via-gray-700 via-9% to-black to-90% pt-32 text-gray-200"
    >
      <div className="container mx-auto mb-0 px-6">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <section className="min-w-0 md:w-2/5" aria-labelledby="about-title">
            <Link to="/" aria-label="LinguRemi">
              <img
                className="mx-auto mt-0 max-h-32 max-w-60"
                src="/assets/images/logo/LinguRemiLogo.ico"
                alt="LinguRemi"
              />
            </Link>

            <h2 id="about-title" className="sr-only">
              Sobre a LinguRemi
            </h2>

            <p className="mt-6 max-w-full overflow-hidden whitespace-normal break-words text-gray-300">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor,
              sit amet consectetur adipisicing elit. Eaque eos consectetur consequuntur sunt
              sequi sint inventore nesciunt, omnis iure repellendus possimus cumque.
            </p>
          </section>

          <section aria-labelledby="company-title">
            <h2 id="company-title" className="font-semibold tracking-wide text-gray-100">
              Company
            </h2>

            <ul className="mt-6 list-none space-y-2">
              <li>
                <Link to="/blog" className="text-gray-300 transition-all duration-500 hover:text-gray-400">
                  Nosso Blog
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 transition-all duration-500 hover:text-gray-400">
                  Trabalhe conosco
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 transition-all duration-500 hover:text-gray-400">
                  Contato
                </a>
              </li>
            </ul>
          </section>

          <section aria-labelledby="social-title">
            <h2 id="social-title" className="font-semibold tracking-wide text-gray-100">
              Redes sociais
            </h2>

            <ul className="mt-6 list-none space-y-2">
              <li>
                <a href="https://web.whatsapp.com" target="_blank" rel="noreferrer" className="text-gray-300 transition-all duration-500 hover:text-gray-400">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="text-gray-300 transition-all duration-500 hover:text-gray-400">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/" target="_blank" rel="noreferrer" className="text-gray-300 transition-all duration-500 hover:text-gray-400">
                  TikTok
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>

      <div className="mt-1 pb-10 text-center">©LinguRémi 2025</div>
    </footer>
  )
}