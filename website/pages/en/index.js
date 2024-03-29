/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
    render() {
        const {siteConfig, language = ''} = this.props;
        const {baseUrl, docsUrl} = siteConfig;
        const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
        const langPart = `${language ? `${language}/` : ''}`;
        const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

        const SplashContainer = props => (
            <div className="homeContainer">
                <div className="homeSplashFade">
                    <div className="wrapper homeWrapper">{props.children}</div>
                </div>
            </div>
        );

        const Logo = props => (
            <div className="projectLogo">
                <img src={props.img_src} alt="Project Logo" />
            </div>
        );

        const ProjectTitle = () => (
            <h2 className="projectTitle">
                {siteConfig.title}
                <small>{siteConfig.tagline}</small>
            </h2>
        );

        const PromoSection = props => (
            <div className="section promoSection">
                <div className="promoRow">
                    <div className="pluginRowBlock">{props.children}</div>
                </div>
            </div>
        );

        const Button = props => (
            <div className="pluginWrapper buttonWrapper">
                <a className="button" href={props.href} target={props.target}>
                    {props.children}
                </a>
            </div>
        );


        return (
            <SplashContainer>
                <Logo img_src={`${baseUrl}img/server.svg`} />
                <div className="inner">
                    <ProjectTitle siteConfig={siteConfig} />
                    <PromoSection>
                        <Button href={docUrl('technology.html')}>Technology</Button>
                        <Button href={docUrl('documentation.html')}>Documentation</Button>
                    </PromoSection>
                </div>
            </SplashContainer>
        );
    }
}

class Index extends React.Component {
    render() {
        const {config: siteConfig, language = ''} = this.props;
        const {baseUrl} = siteConfig;

        const Block = props => (
            <Container
                padding={['top']}
                id={props.id}
                background={props.background}>
                <GridBlock
                    align="center"
                    contents={props.children}
                    layout={props.layout}
                />
            </Container>
        );

        const FeatureCallout = () => (
            <div
                className="productShowcaseSection"
                style={{}}>
                <h2>What is QuestDB?</h2>

                <p>
                    QuestDB is a high-performance low-latency database.
                    We offer latencies in nanoseconds while minimising hardware footprint.
                    We write at below 90 nanoseconds per entry.
                </p>

                <p>
                    We achieve this with cutting-edge proprietary software that pushes today's to the maximum
                    and defines the performance standard of tomorrow.
                </p>

                <p>
                    We also offer trading technology such as microsecond messaging services,
                    and nanosecond orderbook calculators
                </p>

            </div>
        );

        const TryOut = () => (
            <Block id="try">
                {[
                    {
                        content:
                            'Switch from Postgres in moments using the same integrations you already built. ' +
                            'Integrate easily with your applications. We support JAVA natively and can run as a library. ' +
                            'We also offer a REST API and web server. Last but not least, we talk SQL.',
                        image: `${baseUrl}img/undraw_code_review.svg`,
                        imageAlign: 'left',
                        textAlign: `justified`,
                        title: '... and ease of use',
                    },
                ]}
            </Block>
        );

        const Description = () => (
            <Block>
                {[
                    {
                        content:
                            'This is another description of how this project is useful',
                        image: `${baseUrl}img/undraw_note_list.svg`,
                        imageAlign: 'right',
                        title: 'Description',
                    },
                ]}
            </Block>
        );

        const About = () => (
            <Block>
                {[
                    {
                        content:
                            'QuestDB is the fruit of years in R&D in high-frequency and low-latency trading. Our stack is built from the ground up' +
                            'for performance, efficiency, and reliability. ',
                        image: `${baseUrl}img/speed.svg`,
                        imageAlign: 'right',
                        textAlign: 'justified',
                        title: 'We are all about performance...',
                    },
                ]}
            </Block>
        );

        const Features = () => (
            <Block layout="fourColumn">
                {[
                    {
                        content: 'Unrivaled read / write speed and reliable performance',
                        image: `${baseUrl}img/undraw_react.svg`,
                        imageAlign: 'top',
                        title: 'Nanosecond Latency',
                    },
                    {
                        content: 'Run natively on any platform, however low or high spec',
                        image: `${baseUrl}img/maintenance.svg`,
                        imageAlign: 'top',
                        title: 'Full vertical scalability',
                    },
                    {
                        content: 'We support standard ANSI SQL, with additional augmented features on top',
                        image: `${baseUrl}img/setup_wiz.svg`,
                        imageAlign: 'top',
                        title: 'Interact in SQL',
                    },
                ]}
            </Block>
        );

        const Showcase = () => {
            if ((siteConfig.users || []).length === 0) {
                return null;
            }

            const showcase = siteConfig.users
                .filter(user => user.pinned)
                .map(user => (
                    <a href={user.infoLink} key={user.infoLink}>
                        <img src={user.image} alt={user.caption} title={user.caption} />
                    </a>
                ));

            const pageUrl = page => baseUrl + (language ? `${language}/` : '') + page;


            return (
                <div className="productShowcaseSection paddingBottom">
                    <h2>Who is Using This?</h2>
                    <p>This project is used by all these people</p>
                    <div className="logos">{showcase}</div>
                    <div className="more-users">
                        <a className="button" href={pageUrl('users.html')}>
                            More {siteConfig.title} Users
                        </a>
                    </div>
                </div>
            );
        };

        /*@Tanc > Structure of page here*/
        /**
         removed <description />
         */

        return (
            <div>
                <HomeSplash siteConfig={siteConfig} language={language} />
                <div className="mainContainer">
                    <FeatureCallout />
                    <Features />
                    <About />
                    <TryOut />
                    <Showcase />
                </div>
            </div>
        );
    }
}

module.exports = Index;


