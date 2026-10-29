import React from "react";

import imgIconBolt from "../../../assets/case-study/03a90be5-d38ac.svg";
import imgIconBook from "../../../assets/case-study/03a90be5-deaba.svg";

export default function ReadingToggle() {
  return (
    <div className="sg-31 sg-34 sg-57 sg-137 sg-274 sg-329" data-node-id="4700:210" data-name="Reading toggle">
      <a className="sg-31 sg-32 sg-34 sg-48 sg-137 sg-274 sg-307" data-node-id="4700:211" data-name="Segment · Quick read">
        <div className="sg-12 sg-244 sg-274 sg-287 sg-307 sg-322" data-node-id="4700:212" data-name="Chip">
          <div className="sg-3 sg-159 sg-315 sg-374" data-node-id="4700:214" data-name="Icon · bolt">
            <img alt="" loading="lazy" decoding="async" className="sg-3 sg-23 sg-126 sg-227 sg-329" src={imgIconBolt} />
          </div>
        </div>
        <div className="sg-2 sg-31 sg-34 sg-36 sg-55 sg-139 sg-152 sg-274 sg-307 sg-330 sg-351 sg-520" data-node-id="4700:215" data-name="Label">
          <p className="sg-39 sg-43 sg-233 sg-274 sg-307 sg-338 sg-411" data-node-id="4700:216" style={{ fontVariationSettings: '"wdth" 100' }}>
            Skim it
          </p>
          <p className="sg-40 sg-44 sg-232 sg-274 sg-307 sg-334" data-node-id="4700:217" style={{ fontVariationSettings: '"wdth" 100' }}>
            The highlights · 3 min
          </p>
        </div>
      </a>
      <div className="sg-31 sg-34 sg-48 sg-137 sg-274 sg-307" data-node-id="4700:218" data-name="Segment · Full story">
        <div className="sg-6 sg-244 sg-274 sg-287 sg-307 sg-322" data-node-id="4700:219" data-name="Chip">
          <div className="sg-3 sg-159 sg-315 sg-374" data-node-id="4700:221" data-name="Icon · book">
            <img alt="" loading="lazy" decoding="async" className="sg-3 sg-23 sg-126 sg-227 sg-329" src={imgIconBook} />
          </div>
        </div>
        <div className="sg-2 sg-31 sg-34 sg-36 sg-55 sg-139 sg-152 sg-274 sg-307 sg-330 sg-520" data-node-id="4700:222" data-name="Label">
          <p className="sg-39 sg-43 sg-274 sg-307 sg-338 sg-411" data-node-id="4700:223" style={{ fontVariationSettings: '"wdth" 100' }}>
            Read it all
          </p>
          <p className="sg-40 sg-44 sg-236 sg-274 sg-307 sg-334" data-node-id="4700:224" style={{ fontVariationSettings: '"wdth" 100' }}>
            Research to rollout · 9 min
          </p>
        </div>
      </div>
    </div>
  );
}
