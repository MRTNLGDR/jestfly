
import React from 'react';
import {
  TypographyDisplay,
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyLead,
  TypographyP,
  TypographySmall,
  TypographyMuted,
  TypographyGradient,
  TypographyMetric
} from './ui/typography';

const TypographyShowcase: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6">
      <TypographyDisplay className="mb-6">
        Transform your data into <TypographyGradient>actionable solutions</TypographyGradient>
      </TypographyDisplay>
      
      <TypographyLead className="mb-10">
        Our platform helps businesses leverage the power of data analytics to drive growth and innovation.
      </TypographyLead>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="space-y-2">
          <TypographyMetric>98%</TypographyMetric>
          <TypographyMuted>Customer satisfaction rate</TypographyMuted>
        </div>
        <div className="space-y-2">
          <TypographyMetric>+300%</TypographyMetric>
          <TypographyMuted>Business growth for clients</TypographyMuted>
        </div>
        <div className="space-y-2">
          <TypographyMetric>24/7</TypographyMetric>
          <TypographyMuted>Enterprise support</TypographyMuted>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <TypographyH2 className="text-gradient-gold">
            Business Application
          </TypographyH2>
          <TypographyP>
            Our enterprise-grade solutions offer scalable infrastructure, robust security, and flexible integration options to meet your business needs.
          </TypographyP>
        </div>
        <div>
          <TypographyH2 className="text-gradient-blue">
            Technical Solutions
          </TypographyH2>
          <TypographyP>
            Leverage our advanced APIs, machine learning models, and data pipeline tools to build custom applications and workflows.
          </TypographyP>
        </div>
      </div>
      
      <div className="mb-16">
        <TypographyH3>Typography Examples</TypographyH3>
        <div className="space-y-6 mt-6">
          <div>
            <TypographyH1>Heading Level 1</TypographyH1>
            <TypographyP>This is a paragraph that follows a heading level 1. It demonstrates the spacing and relationship between heading elements and paragraph text in the design system.</TypographyP>
          </div>
          
          <div>
            <TypographyH2>Heading Level 2</TypographyH2>
            <TypographyP>This is a paragraph that follows a heading level 2. The spacing and font weight are optimized for readability and visual hierarchy.</TypographyP>
          </div>
          
          <div>
            <TypographyH3>Heading Level 3</TypographyH3>
            <TypographyP>This is a paragraph that follows a heading level 3. Notice the balanced proportions between different heading levels.</TypographyP>
          </div>
          
          <div>
            <TypographyH4>Heading Level 4</TypographyH4>
            <TypographyP>This is a paragraph that follows a heading level 4. Even at smaller sizes, the typography remains clear and legible.</TypographyP>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <TypographySmall>Terms and conditions apply. All features may not be available in all regions.</TypographySmall>
        <TypographyMuted>© 2023 JESTFLY. All rights reserved.</TypographyMuted>
      </div>
    </div>
  );
};

export default TypographyShowcase;
